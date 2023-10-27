import { Sequelize } from 'sequelize';
import { Precio, Categoria, Propiedad } from '../models/asociaciones.js';

export const inicio = async (req, res) => {
  const [categorias, precios, casas, apartamentos] = await Promise.all([
    Categoria.findAll({ raw: true }), //trae solo filas
    Precio.findAll({ raw: true }), //trae solo filas
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1
      },
      include: [
        {model: Precio, as: 'precio'}
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 2
      },
      include: [
        {model: Precio, as: 'precio'}
      ],
      order: [
        ['createdAt', 'DESC']
      ]
    })
  ]);
  //console.log(categorias)

  res.render('inicio', {
    pagina: 'inicio',
    categorias,
    precios, 
    casas,
    apartamentos,
    csrfToken: req.csrfToken()
  });
};

export const categoria = async (req, res) => {
  const { id } = req.params
  //console.log(id)

  //Validar que existe la categoria
  const categoria = await Categoria.findByPk(id)
  if(!categoria) {
    return res.redirect('/404')
  }

  //Obtener las propiedades de la categoria
  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id
    },
    include: [
      {model: Precio, as: 'precio'}
    ]
  })

  res.render('categoria', {
    pagina: `${categoria.nombre}s en Venta`,
    propiedades,
    csrfToken: req.csrfToken()
  })
};

export const noEncontrado = (req, res) => {
  res.render('404',{
    pagina: 'No Encontrada',
    csrfToken: req.csrfToken()
  })
};

export const buscador = async (req, res) => {

  const {termino} = req.body

  //Validamos que termino no este vacio
  if(!termino.trim()) {
    return res.redirect('back') //devuelve a la pagina anterior
  }

  //consultar las propiedades
  const propiedades = await Propiedad.findAll({
    where: {
      titulo: {
        [Sequelize.Op.like]: '%' + termino + '%'
      }
    },
    include: [
      {model: Precio, as: 'precio'}
    ]
  })
  //console.log(propiedades)

  res.render('busqueda', {
    pagina: 'Resultados de la Busqueda',
    propiedades,
    csrfToken: req.csrfToken()
  })

};
