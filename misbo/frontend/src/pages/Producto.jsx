import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { obtenerProducto } from "../services/productos.services";

import { useCarrito } from "../context/useCarrito";

import LoadingPage from "./LoadingPage";

export default function Producto() {
    const { productoId } = useParams()
    
    const [cargando, setCargando] = useState(true)
    const [producto, setProducto] = useState({})
    const [error, setError] = useState('')

    const { agregarItem } = useCarrito()
    const [agregado, setAgregado] = useState(false)

    useEffect(() => {
        obtenerProducto(productoId)
            .then(setProducto)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false))
    }, [productoId])

    function agregarProducto() {
        agregarItem(producto, 1)
        setAgregado(true)
        setTimeout(() => setAgregado(false), 1500)
    }

    if (cargando) return <LoadingPage/>
    if (error) return <p style={{ color: 'red' }}>Producto no encontrado.</p>

    return (
        <div>
            <h1>{producto.nombre}</h1>
            <button onClick={agregarProducto} disabled={producto.stock === 0}>
                {agregado ? 'Agregado ✓' : 'Agregar al carrito'}
            </button>
            <Link to="/carrito">Carrito</Link>
        </div>
    )
}