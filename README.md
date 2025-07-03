# 🌍 nginx-PM_geo-map-app

**Live-Geodatenkarte für den NGINX Proxy Manager**

Dies ist eine Node.js-Anwendung zur Visualisierung von Zugriffen auf Domains des NGINX Proxy Managers auf einer Weltkarte.

![Geo Map Screenshot](https://github.com/bmetallica/nginx-PM_geo-map-app/blob/main/Screenshot.jpg)

---

## 📋 Voraussetzungen

- Installiertes **Node.js** mit **npm**
- Zugriff auf die **Logdateien des NGINX Proxy Managers**

---

## ⚙️ Installation

### 1. Projekt klonen

```bash
git clone https://github.com/bmetallica/nginx-PM_geo-map-app.git
cd nginx-PM_geo-map-app
```

### 2. Node-Projekt initialisieren

```bash
npm init -y
```

### 3. Abhängigkeiten installieren

```bash
npm install express ws geoip-lite socket.io node-fetch@2
```

---

## 🔧 Konfiguration

- In der Datei `server.js` muss der Pfad zu den Logdateien des NGINX Proxy Managers angepasst werden:

```js
const logPath = "/portainer/Files/AppData/Config/nginx-proxy-manager/data/logs/";
```

---

## 🚀 Starten

```bash
node server.js
```

Anschließend kannst du die Karte im Browser unter folgendem Link aufrufen:

```
http://localhost:3000
```

---

## ✅ Features

- Zeigt eingehende Verbindungen auf einer Weltkarte
- Nutzt GeoIP zur Standortauflösung
- Live-Aktualisierung über WebSocket


---

**Autor:** [bmetallica](https://github.com/bmetallica)
