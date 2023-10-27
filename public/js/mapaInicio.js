/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  //Logical Or para evaluar las coordenadas\r\n  const lat = 10.4621743;\r\n  const lng = -73.2309167;\r\n  const mapa = L.map('mapa-inicio').setView([lat, lng], 13);\r\n\r\n  //creamos grupo de markers capa que estara encima del mapa permite limpiar el resultado previo de los filtros\r\n  let markers = new L.FeatureGroup().addTo(mapa);\r\n  //console.log(markers)\r\n\r\n  let propiedades = [];\r\n\r\n  //filtros\r\n  const filtros = {\r\n    categoria: '',\r\n    precio: '',\r\n  };\r\n  //capturamos los datos cat y pre\r\n  const categoriaSelect = document.querySelector('#categorias');\r\n  const precioSelect = document.querySelector('#precios');\r\n\r\n  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n\r\n  //filtrado de categorias y precios\r\n  categoriaSelect.addEventListener('change', (e) => {\r\n    //console.log(+e.target.value)\r\n    (filtros.categoria = +e.target.value), filtrarPropiedades();\r\n  });\r\n\r\n  precioSelect.addEventListener('change', (e) => {\r\n    (filtros.precio = +e.target.value), filtrarPropiedades();\r\n  });\r\n\r\n  const obtenerPropiedades = async (req, res) => {\r\n    try {\r\n      const url = '/api/propiedades'; //cremos la variable con la url de la API\r\n\r\n      //consumir la API con fetch valida si la conexion es correcta\r\n      const respuesta = await fetch(url);\r\n      propiedades = await respuesta.json(); //trae los datos formato json\r\n      //console.log(propiedades)\r\n\r\n      mostrarPropiedades(propiedades);\r\n    } catch (error) {\r\n      console.log(error);\r\n    }\r\n  };\r\n\r\n  const mostrarPropiedades = (propiedades) => {\r\n    //console.log(propiedades)\r\n\r\n    //Limpia los Pines y Muestra los que cumplen con el Filtrado\r\n    markers.clearLayers();\r\n\r\n    propiedades.forEach((propiedad) => {\r\n      //Agregar los pines de las propiedades al mapa\r\n      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n        autoPan: true, //centra en el mapa\r\n      }).addTo(mapa) //muestra los pines en el mapa\r\n        .bindPopup(`\r\n          <p class=\"text-green-600 font-bold\">${propiedad?.categoria?.nombre}</p>\r\n          <h1 class=\"text-xl font-extrabold uppercase my-2\">${propiedad?.titulo}</h1>\r\n          <img src=\"/image/uploads/${propiedad?.imagen}\" \r\n          alt=\"Imagen de la propiedad ${propiedad?.titulo}\">\r\n          <p class=\"text-indigo-600 font-bold\">${propiedad?.precio?.nombre}</p>\r\n          <a href=\"/propiedad/${propiedad.id}\" class=\"bg-green-600 block p-2 text-center font-bold uppercase\">Ver Propiedad</a>\r\n        \r\n        `);\r\n      markers.addLayer(marker); //limpia result q no coincid con los criteri busq\r\n    });\r\n  };\r\n\r\n  const filtrarPropiedades = () => {\r\n    //console.log(propiedades)\r\n    const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);\r\n    //console.log(resultado)\r\n    mostrarPropiedades(resultado);\r\n  };\r\n\r\n  const filtrarCategoria = (propiedad) =>\r\n    filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;\r\n\r\n  const filtrarPrecio = (propiedad) =>\r\n    filtros.precio ? propiedad.precioId === filtros.precio : propiedad;\r\n\r\n  obtenerPropiedades();\r\n})();\r\n\n\n//# sourceURL=webpack://bienesraices/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;