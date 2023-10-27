import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

import usuarioRoutes from './routes/usuarioRoutes.js';
import propiedadesRoutes from './routes/propiedadesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';

//Create application
const app = express();

//conexion a la base de datos
try {
  await db.authenticate();
  db.sync(); //crea las tablas si no existen
  console.log('Conexion a la base de datos ok');
} catch (error) {
  console.log(error);
}

//Habilitar lectura datos de formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Habilitar Cookie Parser
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({ cookie: true }));

//Habilitar template engine pug
app.set('view engine', 'pug'); //Template a utilizar
app.set('views', './views'); // carpeta donde se encuentra

//Carpeta publica
app.use(express.static('public'));

//Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes)

//Definition port and start the proyect
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port [http://localhost:${PORT}]`);
});
