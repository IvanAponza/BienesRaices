import { unlink } from 'node:fs/promises'
import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad, Mensaje, Usuario} from '../models/asociaciones.js'
import { esVendedor, formatearFecha } from '../helpers/mensaje.js'


//PAGINA ADMINISTRAR PROPIEDAD
export const admin = async (req, res) => {

  //Leer queryString para paginar
  //console.log(req.query)

  const { pagina: paginaActual } = req.query
  
  const regexp = /^[1-9]$/ //valid q sea num /[0-9]/ (^) <-init num ($)<-fin num 

  if (!regexp.test(paginaActual)) {
    return res.redirect('/mis-propiedades?pagina=1')
  }

  try {
    const { id } = req.usuario

    //Limites y Offset para el paginador
    const limit = 5
    const offset = ((paginaActual * limit) - limit)

    const [propiedades, total] = await Promise.all([
      Propiedad.findAll({
        limit,
        offset,
        where: {
          usuarioId: id
        },
        //include modelo en la consulta para mostrar nombre de la cat en la vista
        include: [
          {model: Categoria, as: 'categoria'},
          {model: Precio, as: 'precio'},
          {model: Mensaje, as: 'mensajes'}
        ]
      }),
      Propiedad.count({
        where: {
          usuarioId: id
        }
      })
    ])
    //console.log(total)

    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades',
        csrfToken: req.csrfToken(),
        propiedades,
        paginas: Math.ceil(total / limit), //redondea hacia riba Math.ceil 
        paginaActual: +paginaActual, //Number(paginaActual) convierte num
        limit,
        total,
        offset,
    });
  } catch (error) {
    console.log(error)
  }  
}

//CREAR PROPIEDAD
export const crear = async (req, res) => {

  //Consultar Modelos de precios y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/crear', {
    pagina: 'Crear Propiedad',
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {}
  });
}

//GUARDAR PROPIEDAD
export const guardar = async (req, res) => {
  
  //Validacion campos
  let result = validationResult(req)

  if(!result.isEmpty()) {

    //Consultar Modelos de precios y categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])

    res.render('propiedades/crear', {
      pagina: 'Crear Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios, 
      errors: result.array(),
      datos: req.body
    });
  }

  //Crear registro
  const {titulo, descripcion, habitaciones, parqueadero, banos, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body;

  const { id: usuarioId } = req.usuario

  try {
    const propiedadGuardada = await Propiedad.create({
        titulo,
        descripcion,
        habitaciones, 
        parqueadero, 
        banos, 
        calle, 
        lat, 
        lng, 
        precioId,
        categoriaId,
        usuarioId,
        imagen: ''
    })

    const { id } = propiedadGuardada

    res.redirect(`/propiedades/agregar-imagen/${id}`)

  } catch (error) {
    console.log(error)    
  }
}

//AGREGAR IMAGEN
export const agregarImagen = async (req, res) => {
  //console.log('Agregando Imagen...')

  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Validar que la propiedad ho este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades')
  }

  //Validar que la propiedad pertenesca a usuario que creo la propiedad 
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
    return res.redirect('/mis-propiedades')
  }
  
  res.render('propiedades/agregar-imagen', {
    pagina: `Agregar Imagen: ${propiedad.titulo} `,
    csrfToken: req.csrfToken(),
    propiedad
  })
}

export const almacenarImagen = async (req, res, next) => {
  
  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Validar que la propiedad no este publicada
  if(propiedad.publicado){
    return res.redirect('/mis-propiedades')
  }

  //Validar que la propiedad pertenesca a usuario que creo la propiedad 
  if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
    return res.redirect('/mis-propiedades')
  }

  try {
    //console.log(req.file)

    //almacenar imagen 
    propiedad.imagen = req.file.filename

    //publicar la propiedad
    propiedad.publicado = 1

    //Guarda la propiedad
    await propiedad.save()

    next()

  } catch (error) {
    console.log(error)
  }
}

//EDITAR PROPIEDAD
export const editar = async (req, res) => {

  const { id } = req.params

  //Valida que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Valida que sea el usuario que creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  //Consultar Modelos de precios y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
  ])

  res.render('propiedades/editar', {
    pagina: `Editar Propiedad: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad //llena los campos de la vista en automatico
  });
}

//GUARDAR CAMBIOS DE EDITAR PROPIEDAD
export const guardarCambios = async (req, res) => {

  //Verifica la validacion
  let result = validationResult(req)

  if(!result.isEmpty()) {

    //Consultar Modelos de precios y categorias
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll()
    ])

    return res.render('propiedades/editar', {
      pagina: 'Editar Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errors: result.array(),
      datos: req.body
    });
  }

  const { id } = req.params

  //Valida que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Valida que sea el usuario que creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  //Reescribir el objeto y Actualiza
  try {
   
    const {titulo, descripcion, habitaciones, parqueadero, banos, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body;

    propiedad.set({
      titulo, 
      descripcion, 
      habitaciones, 
      parqueadero, 
      banos, 
      calle, 
      lat, 
      lng, 
      precioId, 
      categoriaId
    })

    await propiedad.save()

    res.redirect('/mis-propiedades')

  } catch (error) {
    console.log(error)
  }
}

//ELIMINAR PROPIEDAD
export const eliminar = async (req, res) => {

  const { id } = req.params

  //Valida que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Valida que sea el usuario que creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  //Eliminar la imagen asociada a la propiedad
  await unlink(`public/image/uploads/${propiedad.imagen}`)
  console.log(`Se Elimino la imagen ${propiedad.imagen}`)

  //Eliminar la propiedad
  await propiedad.destroy()
  res.redirect('/mis-propiedades')
}

//MODIFICAR ESTADO DE LA PROPIEDAD
export const cambiarEstadoPropiedad = async (req, res) => {
 
  const { id } = req.params

  //Valida que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Valida que sea el usuario que creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  //cambiar estado de la propiedad
  propiedad.publicado = !propiedad.publicado
  await propiedad.save()

  res.json({
    resultado: true
  })

}

//MOSTRAR PROPIEDADES PUBLICAS
export const mostrarPropiedad = async (req, res) => {
  
  const { id } = req.params

  //console.log(req.usuario)

  //Valida que exista la propiedad
  const propiedad = await Propiedad.findByPk(id, {
    include:[
      {model: Categoria, as: 'categoria'},
      {model: Precio, as: 'precio'}
    ]
  })

  //Evita acceso a una propiedad no publicada
  if (!propiedad || !propiedad.publicado) {
    return res.redirect('/404')
  }

  //console.log(esVendedor(req.usuario?.id, propiedad.usuarioId))

  res.render('propiedades/mostrar', {
    pagina: propiedad.titulo,
    propiedad,
    csrfToken: req.csrfToken(),
    usuario: req.usuario, //identificar el usuario en la vista
    esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)  
  })
}

//ENVIAR MENSAJE A UN PROPIETARIO
export const enviarMensaje = async (req, res) => {
  const { id } = req.params

 //Valida que exista la propiedad
  const propiedad = await Propiedad.findByPk(id, {
    include:[
      {model: Categoria, as: 'categoria'},
      {model: Precio, as: 'precio'}
    ]
  })

  if (!propiedad) {
    return res.redirect('/404')
  }

  //Renderiza los errores
  let result = validationResult(req)

  if(!result.isEmpty()) {

    return res.render('propiedades/mostrar', {
      pagina: propiedad.titulo,
      propiedad,
      csrfToken: req.csrfToken(),
      usuario: req.usuario, 
      esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
      errors: result.array() 
    })
  }
  
  //Almacenar el mensaje

  /*console.log(req.body)
  console.log(req.params)
  console.log(req.usuario)
  return*/
  
  const { mensaje } = req.body
  const { id: propiedadId } = req.params
  const { id: usuarioId } = req.usuario

  await Mensaje.create({
      mensaje,
      propiedadId,
      usuarioId
  })

  res.redirect('/')
}

//LEER MENSAJES RECIBIDOS POR UN USUARIO
export const verMensajes = async (req, res) => {

  const { id } = req.params

  //Valida que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include:[
      {model: Mensaje, as: 'mensajes',
        include:[
          {model: Usuario.scope('eliminarPassword'), as: 'usuario'} //cruzamos user que envio msg
        ]
      }
    ]
  })

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Valida que sea el usuario que creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  //Enviar email al propietario sobre mensaje recibido de la propiedad

  res.render('propiedades/mensajes', {
    pagina: 'Mensajes',
    mensajes: propiedad.mensajes, //pasamos los msg a la vista
    formatearFecha
  })
}
