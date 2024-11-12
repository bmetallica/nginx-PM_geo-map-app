# nginx-PM_geo-map-app
Eine Geomap für den nginx Proxy Manager

Es handelt sich um eine NodeJS Anwendung.
Voraussetzung ist das Nodejs mit npm installiert ist und der Pfad der Logdateien des Nginx Proxy manager bekannt ist.

Installation


1. mit https://github.com/bmetallica/nginx-PM_geo-map-app.git downloaden

2. mit "cd geo-map-app" in das Verzeichnis wechseln.

3. mit "npm init -y" Projekt initialisieren

4. mit "npm install express ws geoip-lite socket.io node-fetch@2" Abhängigkeiten installieren

5. in der server.js muss der Pfad zu den Logdateien des Nginx-PM angepasst werden

6. mit "node server.js" starten

7. Die Karte kann dann mit dem Browser unter http://localhost:3000 aufgerufen werden.
