import { exit } from 'node:process';
import categorias from "./categorias.js";
import db from "../config/db.js";
import precios from './precios.js';
import usuarios from './usuarios.js';
import { Categoria, Precio, Usuario} from '../models/asociaciones.js';

const importarDatos = async () => {
  try {

    //Autenticar en DB
    await db.authenticate();

    //Generar las columnas en DB
    await db.sync();

    //Insertamos los datos DB -> Promise.all inserta los datos al mismo tiempo procesos independientes
    await Promise.all([ 
        Categoria.bulkCreate(categorias),
        Precio.bulkCreate(precios),
        Usuario.bulkCreate(usuarios)
    ])

    console.log('Datos importados correctamente')
    exit(); // vacio o cero termina y fue correcto

  } catch (error) {
    console.log(error)
    //process.exit(1);
    exit(1); // codigo 1 termina y trae el error
    
  }
}

const eliminarDatos = async () => {
    try {
        //2. limpia las tablas
        // await Promise.all([ 
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ])

        //1. Elimina y crea nuevamente las tablas
        await db.sync({force: true})
        
        console.log('Datos eliminados correctamente')
        exit();
    } catch (error) {
        console.log(error)
        exit(1);
    }
}

if(process.argv[2] === "-i"){
    importarDatos();
}

if(process.argv[2] === "-e"){
    eliminarDatos();
}
