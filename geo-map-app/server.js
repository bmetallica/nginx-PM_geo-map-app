const fs = require('fs');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const geoip = require('geoip-lite');
const fetch = require('node-fetch');


// Verzeichnis für Logdateien
const logsDirectory = '/portainer/Files/AppData/Config/nginx-proxy-manager/data/logs/';    //PFAD MUSS ANGEPASST WERDEN
const logFilePattern = /.*access\.log$/;
const regex = / https (\S+) .* \[Client (\S+)\] .* \[Sent-to (\S+)\]/;


// Express-App und HTTP-Server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Funktion zum Ermitteln der öffentlichen IP-Adresse
let publicIp = null;
async function getPublicIp() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        publicIp = data.ip;
        //console.log(`Öffentliche IP-Adresse des Servers: ${publicIp}`);
    } catch (error) {
        //console.error('Fehler beim Ermitteln der öffentlichen IP-Adresse:', error);
    }
}

// Funktion zum Parsen der Logzeile und Extrahieren von IP und Domain
function parseLogLine(line) {
    const match = line.match(regex);
    if (match) {
        const domain = match[1];
        const sentto = match[3];
        const ip = match[2];
        return { ip, domain };
    }
    return null;
}

// Funktion zur Überwachung der Logdateien
function monitorLogFiles() {
    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            //console.error(`Fehler beim Lesen des Log-Verzeichnisses: ${err.message}`);
            return;
        }
        const logFiles = files.filter(file => logFilePattern.test(file));
        logFiles.forEach(file => {
            const filePath = path.join(logsDirectory, file);
            fs.watchFile(filePath, { interval: 1000 }, () => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        //console.error(`Fehler beim Lesen der Logdatei ${file}: ${err.message}`);
                        return;
                    }
                    const lines = data.trim().split('\n');
                    const lastLine = lines[lines.length - 1];
                    const parsed = parseLogLine(lastLine);
                    if (parsed && parsed.ip && parsed.ip !== publicIp) {
                        const geo = geoip.lookup(parsed.ip);
                        if (geo) {
                            const lat = geo.ll[0];
                            const long = geo.ll[1];
                            io.emit('logEntry', {
                                ip: parsed.ip,
                                domain: parsed.domain,
                                location: geo.ll,
                                city: geo.city,
                                country: geo.country
                            });
                            //console.log(`Neue Anfrage von IP ${parsed.ip} auf Domain ${parsed.domain}`);

                        }
                    }
                });
            });
        });
    });
}

// Starten der Überwachung und Initialisieren der öffentlichen IP-Adresse
getPublicIp().then(() => {
    monitorLogFiles();
});

// Weboberfläche
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bei jeder neuen Verbindung die öffentliche IP-Adresse an den Client senden
io.on('connection', (socket) => {
    //console.log('Ein neuer Client hat sich verbunden');
    if (publicIp) {
        const geo = geoip.lookup(publicIp);
        if (geo) {
            socket.emit('publicIpLocation', {
                ip: publicIp,
                location: geo.ll,
                city: geo.city,
                country: geo.country,
                symbol: 'home'
            });
        }
    }
});

// Starten des Servers
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
