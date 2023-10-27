(function() {
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')
    //pasamos el token al cambiar el estado
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    cambiarEstadoBotones.forEach(boton => {
        boton.addEventListener('click', cambiarEstadoPropiedades)
    })

    async function cambiarEstadoPropiedades(e) {
        //console.log(e.target.dataset)

        const {propiedadId: id} = e.target.dataset
        
        try {
            //conectar esta funcion con el controlador
            const url = `/propiedades/${id}`

            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })
            //console.log(respuesta)
            const {resultado} = await respuesta.json()
            //console.log(resultado)
            //cambiar clases boton de la propiedad (color y publicado) sin recargar la pagina.
            if(resultado) {
                if (e.target.classList.contains('bg-yellow-200')) {
                    e.target.classList.add('bg-green-200-800', 'text-green-800')
                    e.target.classList.remove('bg-yellow-200', 'text-yellow-800')
                    e.target.textContent = 'Publicado'
                } else {
                    e.target.classList.remove('bg-green-200-800', 'text-green-800')
                    e.target.classList.add('bg-yellow-200', 'text-yellow-800')
                    e.target.textContent = 'No Publicado'
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
})()