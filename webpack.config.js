import path from 'path'

export default {
    mode: 'development', //production
    entry: {
        //ruta donde estara archivos js de entredas
        mapa: './src/js/mapa.js',
        agregarImagen: './src/js/agregarImagen.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        mapaInicio: './src/js/mapaInicio.js',
        cambiarEstadoPropiedad: './src/js/cambiarEstadoPropiedad.js',
    },
    output: {
        //nombres y ruta donde se compilaran los archivos de salida
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}