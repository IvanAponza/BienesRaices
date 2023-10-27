import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/token.js'

const storage = multer.diskStorage({
  //Ruta save storage
  destination: function (req, file, cb) {
    cb(null, './public/image/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, generarId() + path.extname(file.originalname)); //renombrar archivo conca ext
  },
})

const upload = multer({ storage })

export default upload
