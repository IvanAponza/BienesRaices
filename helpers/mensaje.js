
export const esVendedor = (usuarioId, propiedadUsuarioId) =>{
    //retorna true si el usuarioid es el mismo que creo la propiedad
    return usuarioId === propiedadUsuarioId
}

export const formatearFecha = fecha =>{
    //console.log(fecha)
    //convierte fecha a string y cortamos formato de fecha
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)
    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }

    //retorna y convierta a formato fecha nuevamente pero formateada como queremos
    return new Date(nuevaFecha).toLocaleDateString('es-Es', opciones)
}