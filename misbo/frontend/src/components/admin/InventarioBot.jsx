import { useState, useEffect, useCallback } from "react";
import { Backpack, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { obtenerInventarioBot } from "@/services/admin.services.js";

// Cada cuánto se refresca solo cuando el auto-actualizar está activo
const INTERVALO_MS = 5000;

// Números de slot del inventario del bot en Minecraft
const ARMADURA = [
  { slot: 5, etiqueta: "Casco" },
  { slot: 6, etiqueta: "Pechera" },
  { slot: 7, etiqueta: "Pantalones" },
  { slot: 8, etiqueta: "Botas" },
  { slot: 45, etiqueta: "Mano secundaria" },
];
// 9 al 35 = 3 filas del inventario principal, 36 al 44 = hotbar
const SLOTS_PRINCIPAL = Array.from({ length: 27 }, (_, i) => 9 + i);
const SLOTS_HOTBAR = Array.from({ length: 9 }, (_, i) => 36 + i);

// Un cuadrito del inventario (con o sin item)
function Slot({ slot, item, seleccionado, onSeleccionar, etiqueta }) {
  return (
    <button
      type="button"
      onClick={() => onSeleccionar(slot)}
      title={item ? `${item.nombre} x${item.cantidad}` : etiqueta ?? "Vacío"}
      className={`relative w-12 h-12 rounded-md bg-zinc-800 border flex items-center justify-center transition-colors hover:border-purple-500/60 ${
        seleccionado ? "border-purple-400" : "border-zinc-700"
      }`}
    >
      {item &&
        (item.imagenUrl ? (
          <img
            src={item.imagenUrl}
            alt={item.nombre}
            className="w-8 h-8 object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        ) : (
          <span className="text-[9px] text-zinc-400 leading-tight px-0.5 break-all">
            {item.mcItem}
          </span>
        ))}

      {item && item.cantidad > 1 && (
        <span className="absolute bottom-0 right-0.5 text-[11px] font-bold text-white drop-shadow">
          {item.cantidad}
        </span>
      )}
    </button>
  );
}

export default function InventarioBot() {
  const [inventario, setInventario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");
  const [autoActualizar, setAutoActualizar] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  const cargar = useCallback(async () => {
    setActualizando(true);
    try {
      const data = await obtenerInventarioBot();
      setInventario(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  }, []);

  // Carga el inventario al abrir la tab
  useEffect(() => {
    cargar();
  }, [cargar]);

  // Si el auto-actualizar está activo, vuelve a cargar cada INTERVALO_MS
  useEffect(() => {
    if (!autoActualizar) return;
    const id = setInterval(cargar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [autoActualizar, cargar]);

  if (cargando) {
    return (
      <div className="flex items-center gap-2 text-zinc-400">
        <Spinner /> Cargando inventario...
      </div>
    );
  }

  const items = inventario?.items ?? [];
  // Para buscar rápido qué item hay en cada slot: porSlot[9] -> item del slot 9
  const porSlot = Object.fromEntries(items.map((item) => [item.slot, item]));
  const totalUnidades = items.reduce((acc, item) => acc + item.cantidad, 0);
  const seleccionado = slotSeleccionado !== null ? porSlot[slotSeleccionado] : null;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Backpack className="w-5 h-5" /> Inventario del bot
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Lo que MISBot tiene ahora mismo en el juego.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setAutoActualizar((v) => !v)}
            className={`border-zinc-700 hover:bg-zinc-800 hover:text-white ${
              autoActualizar ? "text-purple-400" : "text-zinc-400"
            }`}
          >
            Auto-actualizar: {autoActualizar ? "ON" : "OFF"}
          </Button>
          <Button
            onClick={cargar}
            disabled={actualizando}
            className="bg-purple-600 text-white hover:bg-purple-500"
          >
            <RefreshCw className={`w-4 h-4 ${actualizando ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4">
          Error al cargar el inventario: {error}
        </p>
      )}

      {inventario && !inventario.conectado ? (
        <p className="text-zinc-400 text-sm">
          El bot no está conectado al servidor, así que no hay inventario que
          mostrar.
        </p>
      ) : (
        inventario && (
          <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-8 items-start">
            {/* Cuadrícula del inventario */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-zinc-500 text-[11px] font-semibold tracking-wide mb-2">
                  ARMADURA Y MANO SECUNDARIA
                </p>
                <div className="flex gap-1.5">
                  {ARMADURA.map(({ slot, etiqueta }) => (
                    <Slot
                      key={slot}
                      slot={slot}
                      item={porSlot[slot]}
                      etiqueta={etiqueta}
                      seleccionado={slotSeleccionado === slot}
                      onSeleccionar={setSlotSeleccionado}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-zinc-500 text-[11px] font-semibold tracking-wide mb-2">
                  INVENTARIO
                </p>
                <div className="grid grid-cols-9 gap-1.5 w-fit">
                  {SLOTS_PRINCIPAL.map((slot) => (
                    <Slot
                      key={slot}
                      slot={slot}
                      item={porSlot[slot]}
                      seleccionado={slotSeleccionado === slot}
                      onSeleccionar={setSlotSeleccionado}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-zinc-500 text-[11px] font-semibold tracking-wide mb-2">
                  HOTBAR
                </p>
                <div className="grid grid-cols-9 gap-1.5 w-fit">
                  {SLOTS_HOTBAR.map((slot) => (
                    <Slot
                      key={slot}
                      slot={slot}
                      item={porSlot[slot]}
                      seleccionado={slotSeleccionado === slot}
                      onSeleccionar={setSlotSeleccionado}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen y detalle del slot elegido */}
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-4">
                <p className="text-zinc-500 text-[11px] font-semibold tracking-wide mb-2">
                  RESUMEN
                </p>
                <p className="text-sm text-zinc-300">
                  Slots ocupados:{" "}
                  <span className="text-white font-semibold">{items.length}</span>
                </p>
                <p className="text-sm text-zinc-300">
                  Unidades en total:{" "}
                  <span className="text-white font-semibold">{totalUnidades}</span>
                </p>
              </div>

              <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-4">
                <p className="text-zinc-500 text-[11px] font-semibold tracking-wide mb-2">
                  DETALLE
                </p>
                {slotSeleccionado === null ? (
                  <p className="text-sm text-zinc-500">
                    Haz click en un slot para ver el detalle.
                  </p>
                ) : !seleccionado ? (
                  <p className="text-sm text-zinc-500">
                    El slot {slotSeleccionado} está vacío.
                  </p>
                ) : (
                  <div className="flex flex-col gap-1 text-sm text-zinc-300">
                    <p className="text-white font-semibold text-base">
                      {seleccionado.nombre}
                    </p>
                    {seleccionado.nombrePersonalizado && (
                      <p className="text-zinc-500 text-xs">
                        Nombre personalizado (yunque)
                      </p>
                    )}
                    <p>
                      Item de Minecraft:{" "}
                      <span className="font-mono text-zinc-400">
                        {seleccionado.mcItem}
                      </span>
                    </p>
                    <p>
                      Cantidad:{" "}
                      <span className="text-white font-semibold">
                        {seleccionado.cantidad}
                      </span>
                    </p>
                    <p>
                      Slot:{" "}
                      <span className="text-white font-semibold">
                        {seleccionado.slot}
                      </span>
                    </p>
                    {seleccionado.esShulker && (
                      <p className="text-purple-400">Es una shulker box (kit)</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
