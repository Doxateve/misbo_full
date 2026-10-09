import { useState } from "react";
import { User } from "lucide-react";

import VerPerfil from "@/components/perfil/VerPerfil";
import EditarCuenta from "@/components/perfil/EditarCuenta";
import ComprasPerfil from "@/components/perfil/ComprasPerfil";

const tabs = [
  { label: "Ver perfil", valor: "ver", Componente: VerPerfil },
  { label: "Editar cuenta", valor: "editar", Componente: EditarCuenta },
  { label: "Mis compras", valor: "compras", Componente: ComprasPerfil },
];


export default function Perfil() {
  const [tabActivo, setTabActivo] = useState("ver");

  const tabSeleccionado = tabs.find((tab) => tab.valor === tabActivo);
  const ComponenteActivo = tabSeleccionado.Componente;

  return (
    <div>
      <h1 className="text-4xl font-black text-white mb-5 flex items-center gap-2">
        <User className="w-8 h-8" /> Mi Cuenta
      </h1>

      <div className="grid grid-cols-[200px_1fr] gap-5 items-start">
        <nav className="bg-zinc-900 border border-purple-500/15 rounded-xl p-2 flex flex-col gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.valor}
              onClick={() => setTabActivo(tab.valor)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                tabActivo === tab.valor
                  ? "bg-purple-500/15 text-purple-400 font-medium"
                  : "text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="bg-zinc-950/60 border border-purple-500/10 rounded-2xl p-8">
          <ComponenteActivo />
        </div>
      </div>
    </div>
  );
}