import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { useCarrito } from "../context/useCarrito";

import CarritoDialog from "@/components/CarritoDialog";

const badgeColores = {
  KIT: "bg-purple-500/15 text-purple-400",
  ITEM: "bg-purple-500/15 text-purple-400",
  ROL: "bg-orange-500/15 text-orange-400",
};

export default function Carrito() {
  const [procesando, setProcesando] = useState(false);

  const { items, quitarItem, actualizarCantidad, vaciarCarrito, total } =
    useCarrito();

  // Si no hay items en el carrito
  if (items.length === 0) {
    return (
      <div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia className="w-12 h-12"  variant="icon">
              <ShoppingCart />
            </EmptyMedia>
            <EmptyTitle className="text-4xl font-black text-white">
              Carrito
            </EmptyTitle>
            <EmptyDescription className="text-lg">
              Actualmente no hay productos en tu carrito
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to="/">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] p-5">
                Ver productos
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-black text-white mb-1 flex items-center gap-2">
        <ShoppingCart className="w-8 h-8" /> Carrito
      </h1>
      <p className="text-md text-zinc-500 mb-6">
        Termina las compras que no realizaste
      </p>
      <div className="bg-zinc-950/60 border border-purple-500/10 rounded-xl p-5">
        <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3.5 p-3.5 border-b border-purple-500/5 last:border-b-0"
            >
              <div className="w-18 h-18 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {item.imagenUrl ? (
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="w-11 h-11 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <span className="text-zinc-500 text-[10px]">
                    {item.mcItem ?? item.tipo}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.nombre}</p>
                <span
                  className={`${badgeColores[item.tipo]} text-[10px] font-medium px-1.5 py-0.5 rounded-md inline-block mt-1`}
                >
                  {item.tipo.toLowerCase()}
                </span>
                <p className="text-zinc-500 text-xs mt-1">${item.precio} c/u</p>
              </div>

              <div
                className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1"
                disabled={procesando}
              >
                <button
                  onClick={() =>
                    actualizarCantidad(item.id, Math.max(1, item.cantidad - 1))
                  }
                  disabled={procesando || item.cantidad <= 1}
                  className="w-6 h-6 bg-zinc-800 text-zinc-300 rounded-md flex items-center justify-center hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-white text-sm w-5 text-center">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  disabled={procesando || item.cantidad >= item.stock}
                  className="w-6 h-6 bg-zinc-800 text-zinc-300 rounded-md flex items-center justify-center hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-right w-16">
                <p className="text-white text-sm font-semibold">
                  ${item.precio * item.cantidad}
                </p>
              </div>

              <button
                onClick={() => quitarItem(item.id)}
                disabled={procesando}
                className="w-6 h-6 text-zinc-600 hover:text-red-400 flex items-center justify-center disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950/60 border border-purple-500/10 rounded-xl p-5 flex items-center justify-between mt-5">
        <div>
          <p className="text-zinc-500 text-sm mb-0.5">Total a pagar</p>
          <p className="text-white text-2xl font-bold">${total}</p>
        </div>

        <CarritoDialog
          items={items}
          total={total}
          vaciarCarrito={vaciarCarrito}
          procesando={procesando}
          setProcesando={setProcesando}
        />
      </div>
    </div>
  );
}
