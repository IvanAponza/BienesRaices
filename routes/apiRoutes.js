import { Router } from 'express'
import { propiedades } from '../controllers/apiController.js'

const router = Router()

router.get('/propiedades', propiedades)

export default router