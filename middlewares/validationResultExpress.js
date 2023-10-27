import {body} from 'express-validator'

const bodyPropiedad = [
    body('titulo', 'El titulo es Onligatorio').trim().notEmpty(),
    body('descripcion', 'La Descripcion no puede ir vacia ')
        .trim()
        .notEmpty()
        .isLength({max: 200})
        .withMessage('La descripcion es muy Larga'),
    body('categoria', 'Seleccione una categoria').isNumeric(),
    body('precio', 'Seleccione rango precios').isNumeric(),
    body('habitaciones', 'Seleccione la cantidad de habitaciones').isNumeric(),
    body('parqueadero', 'Seleccione la cantidad de parqueaderos').isNumeric(),
    body('banos', 'Seleccione lacantidad de baños').isNumeric(),
    body('lat', 'Ubica la propiedad en el mapa').notEmpty(),
]

const bodyMensajePropiedad = [
    body('mensaje').isLength({min: 10}).withMessage('El mensaje no puede ir vacio o es muy corto')
]

export {
    bodyPropiedad,
    bodyMensajePropiedad
}
