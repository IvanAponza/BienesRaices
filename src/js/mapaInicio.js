(function () {
  //Logical Or para evaluar las coordenadas
  const lat = 10.4621743;
  const lng = -73.2309167;
  const mapa = L.map('mapa-inicio').setView([lat, lng], 13);

  //creamos grupo de markers capa que estara encima del mapa permite limpiar el resultado previo de los filtros
  let markers = new L.FeatureGroup().addTo(mapa);
  //console.log(markers)

  let propiedades = [];

  //filtros
  const filtros = {
    categoria: '',
    precio: '',
  };
  //capturamos los datos cat y pre
  const categoriaSelect = document.querySelector('#categorias');
  const precioSelect = document.querySelector('#precios');

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);

  //filtrado de categorias y precios
  categoriaSelect.addEventListener('change', (e) => {
    //console.log(+e.target.value)
    (filtros.categoria = +e.target.value), filtrarPropiedades();
  });

  precioSelect.addEventListener('change', (e) => {
    (filtros.precio = +e.target.value), filtrarPropiedades();
  });

  const obtenerPropiedades = async (req, res) => {
    try {
      const url = '/api/propiedades'; //cremos la variable con la url de la API

      //consumir la API con fetch valida si la conexion es correcta
      const respuesta = await fetch(url);
      propiedades = await respuesta.json(); //trae los datos formato json
      //console.log(propiedades)

      mostrarPropiedades(propiedades);
    } catch (error) {
      console.log(error);
    }
  };

  const mostrarPropiedades = (propiedades) => {
    //console.log(propiedades)

    //Limpia los Pines y Muestra los que cumplen con el Filtrado
    markers.clearLayers();

    propiedades.forEach((propiedad) => {
      //Agregar los pines de las propiedades al mapa
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true, //centra en el mapa
      }).addTo(mapa) //muestra los pines en el mapa
        .bindPopup(`
          <p class="text-green-600 font-bold">${propiedad?.categoria?.nombre}</p>
          <h1 class="text-xl font-extrabold uppercase my-2">${propiedad?.titulo}</h1>
          <img src="/image/uploads/${propiedad?.imagen}" 
          alt="Imagen de la propiedad ${propiedad?.titulo}">
          <p class="text-indigo-600 font-bold">${propiedad?.precio?.nombre}</p>
          <a href="/propiedad/${propiedad.id}" class="bg-green-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
        
        `);
      markers.addLayer(marker); //limpia result q no coincid con los criteri busq
    });
  };

  const filtrarPropiedades = () => {
    //console.log(propiedades)
    const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
    //console.log(resultado)
    mostrarPropiedades(resultado);
  };

  const filtrarCategoria = (propiedad) =>
    filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;

  const filtrarPrecio = (propiedad) =>
    filtros.precio ? propiedad.precioId === filtros.precio : propiedad;

  obtenerPropiedades();
})();
