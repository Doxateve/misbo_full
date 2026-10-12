import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Check,
  Copy,
  Crown,
  Package,
  Pickaxe,
  Store,
  User,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ProductoCard from "@/components/ProductoCard";

import { useAuth } from "@/context/useAuth";
import { useCarrito } from "@/context/useCarrito";
import { obtenerProductos } from "@/services/productos.services";

// IP que se muestra en la pagina. Se configura en misbo/frontend/.env:
// VITE_SERVER_IP=tu.ip.o.dominio:25565
const IP_SERVIDOR = import.meta.env.VITE_SERVER_IP || "127.0.0.1:25565";

// Cada categoria enlaza a /tienda?categoria=TIPO (Tienda.jsx lee ese parametro)
const CATEGORIAS = [
  {
    tipo: "ITEM",
    titulo: "Items",
    descripcion: "Objetos sueltos, listos para usar en tu aventura.",
    icono: Package,
  },
  {
    tipo: "KIT",
    titulo: "Kits",
    descripcion: "Shulker boxes completas con todo lo que necesitas.",
    icono: Boxes,
  },
  {
    tipo: "ROL",
    titulo: "Rangos",
    descripcion: "Destaca en el servidor con un rango exclusivo.",
    icono: Crown,
  },
];

const PASOS = [
  {
    titulo: "Crea tu cuenta",
    texto:
      "Regístrate usando exactamente tu username de Minecraft, así sabemos a quién entregarle.",
  },
  {
    titulo: "Elige y paga",
    texto:
      "Agrega items, kits o rangos al carrito y finaliza tu compra desde la tienda.",
  },
  {
    titulo: "Recíbelo en el juego",
    texto:
      "Nuestro bot MISBot va hacia ti dentro del servidor y te entrega tu compra en mano.",
  },
];

// Elige hasta 3 productos destacados, intentando mostrar un tipo distinto de cada uno
function elegirDestacados(productos) {
  const disponibles = productos.filter(
    (p) => p.tipo === "ROL" || p.stock > 0,
  );

  const elegidos = ["KIT", "ITEM", "ROL"]
    .map((tipo) => disponibles.find((p) => p.tipo === tipo))
    .filter(Boolean);

  // Si falta algun tipo, completa con lo que haya
  for (const producto of disponibles) {
    if (elegidos.length >= 3) break;
    if (!elegidos.includes(producto)) elegidos.push(producto);
  }

  return elegidos.slice(0, 3);
}

export default function Home() {
  const { usuario } = useAuth();
  const { agregarItem } = useCarrito();

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [copiado, setCopiado] = useState(false);

  // Si la API falla, la pagina igual se muestra (solo se oculta lo que depende de productos)
  useEffect(() => {
    obtenerProductos()
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setCargandoProductos(false));
  }, []);

  async function copiarIp() {
    try {
      await navigator.clipboard.writeText(IP_SERVIDOR);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // Si el navegador bloquea el portapapeles no pasa nada
    }
  }

  const destacados = elegirDestacados(productos);
  const contar = (tipo) => productos.filter((p) => p.tipo === tipo).length;

  return (
    <div className="flex flex-col gap-20">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-zinc-950 px-8 py-20 text-center bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.22),transparent_60%)]">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
          <Pickaxe className="h-3.5 w-3.5" />
          Tienda oficial del servidor
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white md:text-7xl">
          mis<span className="text-purple-400">bo</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
          {usuario ? (
            <>
              Hola,{" "}
              <span className="font-semibold text-purple-400">
                {usuario.username}
              </span>
              . Kits, items y rangos listos para que te los entreguen en el
              servidor.
            </>
          ) : (
            "Kits, items y rangos listos para que te los entreguen directamente en el servidor."
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.45)] hover:bg-purple-500"
          >
            <Link to="/tienda">
              <Store className="h-4 w-4" />
              Ir a la tienda
            </Link>
          </Button>

          {usuario ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Link to="/perfil">
                <User className="h-4 w-4" />
                Mi perfil
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Link to="/register">
                <UserPlus className="h-4 w-4" />
                Crear cuenta
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* CATEGORIAS */}
      <section>
        <h2 className="mb-1 text-3xl font-black text-white">
          ¿Qué encuentras aquí?
        </h2>
        <p className="mb-6 text-zinc-500">
          Elige una categoría y entra directo a la tienda filtrada.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CATEGORIAS.map(({ tipo, titulo, descripcion, icono: Icono }) => (
            <Link
              key={tipo}
              to={`/tienda?categoria=${tipo}`}
              className="group flex flex-col gap-3 rounded-xl border border-purple-500/15 bg-zinc-900 p-6 transition-colors hover:border-purple-500/50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
                <Icono className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{titulo}</h3>
              <p className="text-sm text-zinc-500">{descripcion}</p>
              <span className="mt-auto flex items-center gap-1 text-sm text-purple-400">
                {cargandoProductos ? "..." : `${contar(tipo)} disponibles`}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS (productos reales de la API; se oculta si no hay) */}
      {destacados.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="mb-1 text-3xl font-black text-white">
                Destacados
              </h2>
              <p className="text-zinc-500">Una muestra de lo que hay en la tienda.</p>
            </div>
            <Link
              to="/tienda"
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {destacados.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onAgregar={(p) => agregarItem(p, 1)}
              />
            ))}
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section>
        <h2 className="mb-1 text-3xl font-black text-white">Cómo funciona</h2>
        <p className="mb-6 text-zinc-500">De la tienda a tu inventario en tres pasos.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PASOS.map((paso, i) => (
            <div
              key={paso.titulo}
              className="rounded-xl border border-purple-500/15 bg-zinc-900 p-6"
            >
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                {i + 1}
              </span>
              <h3 className="mb-1 font-bold text-white">{paso.titulo}</h3>
              <p className="text-sm text-zinc-500">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="rounded-2xl border border-purple-500/20 bg-zinc-900 px-8 py-12 text-center">
        <h2 className="text-3xl font-black text-white">
          {usuario ? "¿Listo para tu próxima compra?" : "Empieza hoy"}
        </h2>
        <p className="mx-auto mt-2 mb-6 max-w-md text-zinc-500">
          {usuario
            ? "Entra a la tienda y pide lo que necesites. Nos vemos en el servidor."
            : "Crea tu cuenta con tu username de Minecraft y compra en menos de un minuto."}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-purple-600 text-white shadow-[0_0_16px_rgba(168,85,247,0.45)] hover:bg-purple-500"
        >
          <Link to={usuario ? "/tienda" : "/register"}>
            {usuario ? "Ir a la tienda" : "Crear mi cuenta"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
