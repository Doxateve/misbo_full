import { useState, useEffect } from "react";
import { CarritoContext } from "./CarritoContext";

export function CarritoProvider({ children }) {
    // Seetea los items como:
    const [items, setItems] = useState(() => {
        // Revisa si hay items guardados en el localStorage
        const guardado = localStorage.getItem('carrito')
        // Retorna lo que hay en el localStorage (si es que hay)
        return guardado ? JSON.parse(guardado) : []
    })

    // Cada vez que items cambia, ejecuta el useEffect()
    useEffect(() => {
        // Mete los items al localstorage
        localStorage.setItem('carrito', JSON.stringify(items))
    }, [items])

    // Funcion para agregar items al carrito
    function agregarItem(producto, cantidad = 1) {
        // Setea en los items:
        setItems((prev) => {
            // Busca si el item existe en el carrito
            const existente = prev.find((item) => item.id === producto.id)

            // Si existe:
            if(existente) {
                // Mapea los items previos del carrito
                return prev.map((item) =>
                    // Si ya hay un item con el id del producto que queremos agregar
                    item.id === producto.id
                        // Le suma la cantidad
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        // Si no, devuelve el item normal
                        : item
                )
            }

            // Setea los productos previos + el producto nuevo
            return [...prev, { ...producto, cantidad }]
        })
    }

    // Funcion para quitar items del carrito
    function quitarItem(productoId) {
        // Seta los items a los previos - el item que se quiere quitar
        setItems((prev) => prev.filter((item) => item.id !== productoId))
    }

    // Funcion para actualizar la cantidad del producto
    function actualizarCantidad(productoId, cantidad) {
        setItems((prev) =>
            prev.map((item) => 
                item.id === productoId ? { ...item, cantidad } : item
            )
        )
    }

    // Funcion para vaciar el carrito
    function vaciarCarrito() {
        setItems([])
    }

    // Total del carrito
    const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

    return (
        <CarritoContext.Provider value={{ items, agregarItem, quitarItem, actualizarCantidad, vaciarCarrito, total }}>
            {children}
        </CarritoContext.Provider>
    )
}