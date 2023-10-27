import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from '../config/db.js';

const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, //No null
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, //No null
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, //No null
    },
    token: DataTypes.STRING,
    confirmarCuenta: DataTypes.BOOLEAN
}, {
    //hash password
    hooks:{
        beforeCreate: async (usuario) => {
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt)
        },
    },
    scopes: {
        eliminarPassword: {
            attributes: {
                exclude: ['password', 'token', 'confirmarCuenta', 'createdAt', 'updatedAt' ]
            }
        }
    }
})

//Metodo personalizado para comprobar password
Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

export default Usuario;