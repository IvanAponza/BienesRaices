import jwt from 'jsonwebtoken';

export const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre}, process.env.JWT_SECRET, {expiresIn: '1d'})

export const generarToken = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

