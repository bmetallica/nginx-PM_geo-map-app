const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

const socket = new WebSocket(`ws://${location.host}`);

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    const { ip, ll, domain } = data;
    
    // Zeige die Informationen auf der Karte an (mit IP und Domain)
    const marker = L.marker([ll[0], ll[1]]).addTo(map);
    marker.bindPopup(`IP: ${ip}<br>Domain: ${domain}`).openPopup();
};
