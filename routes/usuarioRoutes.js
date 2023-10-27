import { Router } from 'express';
import {
  formLogin,
  formRegistro,
  registrar,
  formOlvidePassword,
  confirmarCuenta,
  resetPassword,
  comprobarToken,
  nuevoPassword,
  login,
  cerrarSesion,
} from '../controllers/usuarioController.js';

const router = Router();


router.get('/registro', formRegistro);
router.post('/registro', registrar);

router.get('/login', formLogin);
router.post('/login', login);

router.post('/cerrar-sesion', cerrarSesion)

router.get('/confirmarCuenta/:token', confirmarCuenta);

router.get('/olvide-password', formOlvidePassword);
router.post('/olvide-password', resetPassword);

//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

export default router;
