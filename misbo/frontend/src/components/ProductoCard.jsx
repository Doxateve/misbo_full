import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useCarrito } from "@/context/useCarrito";

const badgeColores = {
  KIT: "bg-purple-500/15 text-purple-400",
  ITEM: "bg-purple-500/15 text-purple-400",
  ROL: "bg-orange-500/15 text-orange-400",
};

export default function ProductoCard({ producto, onAgregar }) {
  const { items } = useCarrito();

  const [agregado, setAgregado] = useState(false);

  const enCarrito =
    items.find((item) => item.id === producto.id)?.cantidad ?? 0;
  const sinStock = producto.tipo !== "ROL" && producto.stock === 0;
  const alcanzoLimite = producto.tipo !== "ROL" && enCarrito >= producto.stock;

  async function agregarItem() {
    onAgregar(producto);
    setAgregado(true);
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

      <div className="flex gap-2">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white shrink-0"
        >
          <Link to={`/productos/${producto.id}`}>
            <Info className="w-4 h-4" />
          </Link>
        </Button>

        <Button
          onClick={() => agregarItem()}
          disabled={sinStock || alcanzoLimite}
          className={`${!agregado ? " bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.35)]" : "bg-purple-900 hover:bg-purple-900 shadow-[0_0_10px_rgba(100,51,148,0.35)]"} flex-1 text-white disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none`}
        >
          {sinStock
            ? "Sin stock"
            : alcanzoLimite
              ? "Stock alcanzado"
              : agregado
                ? "Agregado!"
                : "Agregar"}
        </Button>
      </div>
    </div>
  );
}
