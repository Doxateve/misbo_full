import { Link } from "react-router-dom";

import { useAuth } from "@/context/useAuth";

const INSTAGRAM_HANDLE = "@misbo.oficial";

const IP_SERVIDOR = "misbo.holy.gg";

// lucide-react ya no incluye iconos de marcas, asi que el logo va como SVG propio
function InstagramIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

const claseLink = "text-sm text-zinc-500 hover:text-purple-400 transition-colors";

export default function Footer() {
  const { usuario } = useAuth();

  return (
    <footer className="mt-20 border-t border-purple-500/20 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
        {/* Marca */}
        <div className="md:col-span-2">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-white transition-colors hover:text-purple-400"
          >
            mis<span className="text-purple-400">bo</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-zinc-500">
            Tienda de kits, items y rangos para nuestro servidor de Minecraft.
            Compra aquí y recibe tu pedido en el juego.
          </p>

          <a
            href="https://www.instagram.com/b.netanyahu/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-purple-500/40 hover:text-purple-400"
          >
            <InstagramIcon className="h-4 w-4" />
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        {/* Navegacion */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Navegación</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/" className={claseLink}>Inicio</Link></li>
            <li><Link to="/tienda" className={claseLink}>Tienda</Link></li>
            <li><Link to="/carrito" className={claseLink}>Carrito</Link></li>
          </ul>
        </div>

        {/* Cuenta (cambia segun haya sesion) */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Mi cuenta</h3>
          <ul className="flex flex-col gap-2">
            {usuario ? (
              <>
                <li><Link to="/perfil" className={claseLink}>Mi perfil</Link></li>
                {usuario.rol === "admin" && (
                  <li><Link to="/admin" className={claseLink}>Administración</Link></li>
                )}
              </>
            ) : (
              <>
                <li><Link to="/login" className={claseLink}>Iniciar sesión</Link></li>
                <li><Link to="/register" className={claseLink}>Crear cuenta</Link></li>
              </>
            )}
          </ul>
          <p className="mt-4 text-xs text-zinc-600">
            Servidor: <span className="font-mono text-zinc-400">{IP_SERVIDOR}</span>
          </p>
        </div>
      </div>

      {/* Barra inferior: copyright y aviso legal */}
      <div className="border-t border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MISBO. Todos los derechos reservados.</p>
          <p>
            No somos un producto oficial de Minecraft ni estamos afiliados a
            Mojang ni a Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
