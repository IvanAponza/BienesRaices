import { Router } from 'express'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad, enviarMensaje, verMensajes, cambiarEstadoPropiedad } from '../controllers/propiedadesController.js'
import { bodyMensajePropiedad, bodyPropiedad } from '../middlewares/validationResultExpress.js'
import protegerRuta from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'
import identificarUsuario from '../middlewares/identificarUsuario.js'

const router = Router();

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', protegerRuta, bodyPropiedad, guardar)
router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)
router.post('/propiedades/agregar-imagen/:id', protegerRuta, upload.single('imagen'), almacenarImagen)
router.get('/propiedades/editar/:id', protegerRuta, editar)
router.post('/propiedades/editar/:id', protegerRuta, bodyPropiedad, guardarCambios)
router.post('/propiedades/eliminar/:id', protegerRuta, eliminar)
router.put('/propiedades/:id', protegerRuta, cambiarEstadoPropiedad)

//Area Pública
router.get('/propiedad/:id',identificarUsuario, mostrarPropiedad)

//Almacenar los mensajes
router.post('/propiedad/:id',identificarUsuario, bodyMensajePropiedad, enviarMensaje)

//Ver los mensajes
router.get('/mensajes/:id', protegerRuta, verMensajes)


export default router;