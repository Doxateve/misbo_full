import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCarrito } from "../context/useCarrito";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { usuario, cargando } = useAuth();
  const { items } = useCarrito();

  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-6 h-20 bg-zinc-950 border-b border-purple-500/20">
      <Link
        to="/"
        className="text-xl font-bold text-white tracking-tight hover:text-purple-400 transition-colors"
      >
        mis<span className="text-purple-400">bo</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-sm text-zinc-400 hover:text-purple-400 transition-colors"
        >
          Tienda
        </Link>

        <Link
          to="/carrito"
          className="relative text-sm text-zinc-400 hover:text-purple-400 transition-colors"
        >
          Carrito
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              {totalItems}
            </span>
          )}
        </Link>

        {cargando ? (
          <span className="text-sm text-zinc-500">...</span>
        ) : usuario ? (
          <>
            <Link to="/perfil">
              <span className="text-sm text-zinc-300 hover:text-white">
                Hola,{" "}
                <span className="text-purple-400">{usuario.username}</span>
              </span>
            </Link>
            {usuario?.rol === "admin" ? (
              <Link to="/admin">
              <span className="text-sm text-zinc-300 hover:text-white">
                Admin
              </span>
            </Link>
            ) : (
              <></>
            )}
          </>
        ) : (
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          >
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
