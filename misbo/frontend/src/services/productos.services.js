export async function obtenerProductos() {
    const res = await fetch('/api/productos', { credentials: 'include'  })

    // Convierte la response en json
    const data = await res.json()

    // Si no devuelve 200 OK
    if(!res.ok) {
        throw new Error(data.message)
    }

    // Deveulve los productos
    return data.productos
}

export async function obtenerProducto(productoId) {
    const res = await fetch(`/api/productos/${productoId}`, { credentials: 'include' })

    const data = await res.json()

    // Si no devuelve 200 OK
    if(!res.ok) {
        throw new Error(data.message)
    }

    // Devuelve el producto
    return data.producto

}