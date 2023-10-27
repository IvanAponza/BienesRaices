import bcrypt from 'bcrypt'

const usuarios = [
    {
        name: 'Ivan',
        email: 'ivan@gmail.com',
        confirmarCuenta: 1,
        password: bcrypt.hashSync('password', 10)
    },
    {
        name: 'Camilo',
        email: 'camilo@gmail.com',
        confirmarCuenta: null,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios