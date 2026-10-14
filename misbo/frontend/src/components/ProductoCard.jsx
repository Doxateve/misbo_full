import { Info, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useCarrito } from "@/context/useCarrito";

const badgeColores = {
  KIT: "bg-purple-500/15 text-purple-400",
  ITEM: "bg-purple-500/15 text-purple-400",
  ROL: "bg-orange-500/15 text-orange-400",
};

export default function ProductoCard({ producto, onAgregar }) {
  const { items, actualizarCantidad, quitarItem } = useCarrito();

  const enCarrito =
    items.find((item) => item.id === producto.id)?.cantidad ?? 0;
  // "Añadido" depende de lo que hay en el carrito
  const agregado = enCarrito > 0;
  const sinStock = producto.tipo !== "ROL" && producto.stock === 0;
  const alcanzoLimite = producto.tipo !== "ROL" && enCarrito >= producto.stock;

  function agregarItem() {
    onAgregar(producto);
  }

  // Lo contrario de agregarItem: resta 1, y si solo queda 1 lo quita del carrito
  function quitarUnItem() {
    if (enCarrito > 1) {
      actualizarCantidad(producto.id, enCarrito - 1);
    } else {
      quitarItem(producto.id);
    }
  }

  return (
    <div
      className={`bg-zinc-900 border border-purple-500/15 rounded-xl p-4 flex flex-col gap-2.5 ${sinStock ? "opacity-50" : ""}`}
    >
      <div className="h-35 bg-zinc-800 rounded-lg flex items-center justify-center">
        <span className="text-zinc-500 text-xs">
          <img
            src={producto.imagenUrl}
            alt={producto.mcItem}
            className="w-20 h-20 object-contain"
            // IMPORTANTE PARA QUE LA IMAGEN SE RENDERICE EN PIXELES
            style={{ imageRendering: "pixelated" }}
          />
        </span>
      </div>

      <span
        className={`${badgeColores[producto.tipo]} text-xs font-medium px-2 py-0.5 rounded-md w-fit`}
      >
        {producto.tipo.toLowerCase()}
      </span>

      <p className="text-white text-[15px] font-medium">{producto.nombre}</p>
      <p className="text-zinc-500 text-sm">{producto.descripcion}</p>

      <div className="flex items-center justify-between mt-1">
        <span className="text-white text-base font-extrabold">
          ${producto.precio}
        </span>
        <span
          className={`text-xs ${producto.stock === 0 ? "text-red-400" : "text-zinc-600"}`}
        >
          {producto.tipo === "ROL"
            ? "Sin limite"
            : sinStock
              ? "Sin stock"
              : `Stock: ${producto.stock}`}
        </span>
      </div>

      {agregado ? (
        // Con producto en el carrito: [−] [n] [+]  Añadido
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={quitarUnItem}
              className="rounded-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </Button>

            <span className="min-w-4 text-center text-xs font-bold text-white">
              {enCarrito}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={agregarItem}
              disabled={sinStock || alcanzoLimite}
              className="rounded-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={() => agregarItem()}
            disabled="True"
            className=" bg-purple-900 hover:bg-purple-900 shadow-[0_0_10px_rgba(100,51,148,0.35)] flex-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
          >
            Añadido
          </Button>
        </div>
      ) : (
        // Sin producto en el carrito: [info]  Agregar
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="rounded-full border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white shrink-0"
          >
            <Link to={`/productos/${producto.id}`}>
              <Info className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            onClick={agregarItem}
            disabled={sinStock || alcanzoLimite}
            className="flex-1 bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.35)] hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
          >
            {sinStock
              ? "Sin stock"
              : alcanzoLimite
                ? "Stock alcanzado"
                : "Agregar"}
          </Button>
        </div>
      )}
    </div>
  );
}
