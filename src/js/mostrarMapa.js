(function() {
    const lat = document.querySelector('#lat').textContent
    const lng = document.querySelector('#lng').textContent
    const calle = document.querySelector('#calle').textContent
    const titulo = document.querySelector('#titulo').textContent
    const mapa = L.map('mapa').setView([lat, lng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapa);

    //Mostrar ping 
    L.marker([lat, lng]).addTo(mapa).bindPopup(`${titulo}, ${calle}`)

})()