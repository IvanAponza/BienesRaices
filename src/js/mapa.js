(function () {

  //Logical Or para evaluar las coordenadas 
  const lat = document.querySelector('#lat').value || 10.4621743;
  const lng = document.querySelector('#lng').value || -73.2309167;
  const mapa = L.map('mapa').setView([lat, lng], 13);
  let marker;

  //Utilizar Provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService(); //permitr obtener el nombre de la calle en base a las coordenadas

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //Creamos el Pin
  marker = L.marker([lat, lng], {
    draggable: true, //para poder mover el pin en el mapa
    autoPan: true, //Para centrar el mapa cada que se mueva el pin
  }).addTo(mapa);

  //Detectar el movimiento del pin y reg lat lng
  marker.on('moveend', function (e) {
    marker = e.target;
    //console.log(marker)

    const posicion = marker.getLatLng();
    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)); //para centrarlo cuando se mueva el pin

    //Obtener la info de la calle al soltar el pin
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, result) {
        // console.log(result);
        marker.bindPopup(result.address.LongLabel);

        //LLenar los campos
        document.querySelector('.calle').textContent =
          result?.address?.Address ?? '';
        document.querySelector('#calle').value = result?.address?.Address ?? '';
        document.querySelector('#lat').value = result?.latlng?.lat ?? '';
        document.querySelector('#lng').value = result?.latlng?.lng ?? '';
      });
  });
})();
