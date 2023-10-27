import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import Usuario from '../models/Usuario.js';
import { generarJWT, generarToken } from '../helpers/token.js';
import { emailOlvidePassword, emailRegistro } from '../helpers/emails.js';


export const formRegistro = (req, res) => {
  //console.log(req.csrfToken())
  res.render('auth/registro', {
    pagina: 'Crear cuenta',
    csrfToken: req.csrfToken(),
  });
};

export const registrar = async (req, res) => {
  //Validamos los campos
  await check('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .run(req);
  await check('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('No es un formato Email')
    .run(req);
  await check('password')
    .isLength({ min: 6 })
    .withMessage('El password debe tener minimo 6 caracteres')
    .run(req);
  await check('repite_password')
    .equals(req.body.password)
    .withMessage('No coinciden las contraseñas')
    .run(req);

  let result = validationResult(req);

  //Valida que el result este vacio
  if (!result.isEmpty()) {
    return res.render('auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errors: result.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //Valida que el usuario no este duplicado
  const { nombre, email, password } = req.body;

  const existeUsuario = await Usuario.findOne({ where: { email } });
  if (existeUsuario) {
    return res.render('auth/registro', {
      pagina: 'Crear cuenta',
      csrfToken: req.csrfToken(),
      errors: [{ msg: 'El usuario ya esta Registrado' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //Almacenar un usuario DB
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarToken(),
  });

  //Envio Email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //Mostrar mensaje de confirmacion
  res.render('template/mensaje', {
    pagina: 'Cuenta creada con Éxito',
    mensaje: '!Verifica tu Email y confirma la cuenta en el enlace¡',
  });
};

/** Confirmar cuenta */
export const confirmarCuenta = async (req, res) => {
  const { token } = req.params;

  //Verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar cuenta, intenta de nuevo',
      error: true,
    });
  }

  //Confirmar la cuenta.
  usuario.token = null;
  usuario.confirmarCuenta = true;
  await usuario.save();
  return res.render('auth/confirmar-cuenta', {
    pagina: 'Cuenta confirmada',
    mensaje: 'La cuenta se confirmo Satisfactoriamente',
  });
};

export const formLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Sesión',
    csrfToken: req.csrfToken(),
  });
};

export const login = async (req, res) => {
  //Validación campos
  await check('email', 'El Email es Obligatorio').trim().isEmail().run(req);
  await check('password', 'El password es Obligatorio').trim().notEmpty().run(req);

  let result = validationResult(req);

  //Valida que el result este vacio
  if (!result.isEmpty()) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errors: result.array()
    });
  }

  //Comprobar si el usuario existe
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({where: {email}})
  if(!usuario){
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'El usuario no existe'}]
    });
  }

  //Comprobar si el usuario esta confirmado
  if(!usuario.confirmarCuenta) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Tu cuenta no ha sido confirmada'}]
    });
  }

  //Comprobar el password
  if(!usuario.verificarPassword(password)){
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'El password es incorrecto'}]
    });
  }

  //Autenticar al usuario JWT
  const token = generarJWT({id: usuario.id, nombre: usuario.nombre})

  console.log(token);

  //almacenar token en cookie
  return res.cookie('_token', token, {
    httpOnly: true,
    // secure: true,
    // sameSite: true,

  }).redirect('/mis-propiedades')
  
}



/** Olvide password */
export const formOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu contraseña',
    csrfToken: req.csrfToken(),
  });
};

export const resetPassword = async (req, res) => {
  //Validamos los campos
  await check('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('No es un formato Email')
    .run(req);

  let result = validationResult(req);

  //Valida que el resul este vacio
  if (!result.isEmpty()) {
    //Error
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso a Bienes Raices',
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  //Valida que exista el usuario
  const { email } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso a Bienes Raices',
      csrfToken: req.csrfToken(),
      errors: [{ msg: 'El Email no pertenece a ningún usuario' }],
    });
  }

  //Genera token y guarda en DB
  usuario.token = generarToken();
  await usuario.save();

  //Envia Email
  emailOlvidePassword({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //Mostrar mensaje de confirmacion
  res.render('template/mensaje', {
    pagina: 'Reestablece tu password',
    mensaje: '!Hemos enviado un email con las instrucciones¡',
  });
};

export const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render('auth/comprobar-token', {
      pagina: 'Reestablece tu Password',
      mensaje: 'Hubo un error al validar tu informacion intenta de nuevo',
      errors: true,
    });
  }

  //Mostrar formulario para modificar el password
  res.render('auth/reset-password', {
    pagina: 'Reestablece tu Password',
    csrfToken: req.csrfToken(),
  });
};

export const nuevoPassword = async (req, res) => {
  //Validar el password

  await check('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('El password debe tener minimo 6 caracteres')
    .run(req);

  let result = validationResult(req);

  //Valida que el result este vacio
  if (!result.isEmpty()) {
    return res.render('auth/reset-password', {
      pagina: 'Reestablece tu Password',
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  //Identificar el usuario que hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });

  //Hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash( password, salt);

  //eliminamos token
  usuario.token = null;

  //Guarda nuevo password
  await usuario.save();

  //Mostrar mensaje password Reestablecido
  res.render('auth/confirmar-cuenta', {
    pagina: 'Password Reestablecido',
    mensaje: 'El Password se guerado correctamente',
  });
};

export const cerrarSesion = (req, res) => {
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}

