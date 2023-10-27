import { Dropzone } from 'dropzone'

//const token = document.querySelector('meta[name="csrf-token"]').content
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

//console.log(token)

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí', //dict cambia español msg
    acceptedFiles: '.png, .jpg, .jpeg,',
    maxFilesZise: 5, //max 5 MB
    maxFiles: 1, //Cant max archivos ej: 3, 4, 5.. 10+
    paralleUploads: 1, //Cant archivos que estamos soportando de acuerdo maxFiles
    autoProcessQueue: false, //sube en automatico pero lo colocamos false para que se suba hasta cuando el usuario presione en publicar
    addRemoveLinks: true, //agrega enlace para eliminar arch antes de subir
    dictRemoveFile: 'Borrar Archivo', //cambiar nombre enlace RemoveLinks
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    //function para procesar las img hasta que el usuario de click btn publicar
    init : function(){ //permite reescribir sobre el objeto de dropzone
        const dropzone = this // para no estar escribiendo this a cada rato
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue() //procesa img pasa a true autoProcessQueu
        })

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length == 0){//indica cant archi en cola
                //redirect cuando termino de procesar todos los archivos
                window.location.href = '/mis-propiedades' 
            }
        })

    }
}