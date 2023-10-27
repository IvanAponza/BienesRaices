import jwt from 'jsonwebtoken'
import { Usuario } from '../models/asociaciones.js'

const protegerRuta = async (req, res, next) => {

    //Verificar si existe el token
    const { _token } = req.cookies
    if(!_token) {
        return res.redirect('/auth/login')
    }

    //Comprobar que el token sea valido
    try {

        //Verifica token
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        //creamos scope en el modelo para eliminar inf (password, token ... a la respuesta de la consulta por temas de logs de errores)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)  

        //Almacena el usuario en req 
        if (usuario){
            req.usuario = usuario
        }else {
            return res.redirect('/auth/login')
        }
        return next();
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }  
}

export default protegerRuta
