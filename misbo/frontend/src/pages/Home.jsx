import { useState, useEffect } from "react";
import { Store } from "lucide-react";
// import { Link } from 'react-router-dom'

import { obtenerProductos } from "../services/productos.services";

import ProductoCard from "@/components/ProductoCard";

import { useCarrito } from "@/context/useCarrito";

import LoadingPage from "./LoadingPage";

export default function Home() {
  // Inicia productos con un array
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState(null);

  const { agregarItem } = useCarrito();

  const categorias = [
    { label: "Todos", valor: null },
    { label: "Items", valor: "ITEM" },
    { label: "Kits", valor: "KIT" },
    { label: "Rangos", valor: "ROL" },
  ];

  useEffect(() => {
    obtenerProductos()
      .then(setProductos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return (
    <LoadingPage/>
  )

  if (error)
    return (
      <p style={{ color: "red" }}>Error a la hora de cargar los productos.</p>
    );

  const productosFiltrados = filtro
    ? productos.filter((producto) => producto.tipo === filtro)
    : productos;

  return (
    <div>
      <h1 className="text-4xl font-black text-white mb-1 flex items-center gap-2">
        <Store className="w-8 h-8" /> Tienda
      </h1>
      <p className="text-md text-zinc-500 mb-6">
        Kits, items y rangos listos para entregar en el servidor
      </p>
      <div className="grid grid-cols-[200px_1fr] gap-5 items-start">
        <nav className="bg-zinc-900 border border-purple-500/15 rounded-xl p-2 flex flex-col gap-0.5">
          {categorias.map((categoria) => (
            <button
              key={categoria.label}
              onClick={() => setFiltro(categoria.valor)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                filtro === categoria.valor
                  ? "bg-purple-500/15 text-purple-400 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {categoria.label}
            </button>
          ))}
        </nav>

        <div className="bg-zinc-950/60 border border-purple-500/10 rounded-2xl p-5">
          {productosFiltrados.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              No hay productos en esta categoría.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onAgregar={(producto) => agregarItem(producto, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
