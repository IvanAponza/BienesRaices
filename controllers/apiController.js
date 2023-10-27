import { Propiedad, Categoria, Precio } from '../models/asociaciones.js'

export const propiedades = async (req, res) => {
    const propiedades = await Propiedad.findAll({
        include: [
            //agregamos modelos de las tablas relacionadas a la consulta json
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })
    res.json(propiedades)
}
