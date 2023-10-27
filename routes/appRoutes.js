import { Router } from 'express'
import { buscador, categoria, inicio, noEncontrado } from '../controllers/appController.js';


const router = Router()


//PAGINA DE INICIO
router.get('/', inicio)

//CATEGORIAS
router.get('/categorias/:id', categoria)

//pAGINA 404
router.get('/404', noEncontrado)

//BUSCADOR 
router.post('/buscador', buscador)

export default router;