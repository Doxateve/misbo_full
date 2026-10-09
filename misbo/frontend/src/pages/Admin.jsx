import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Cog } from "lucide-react";

import AgregarItem from "@/components/admin/AgregarItem.jsx";
import Dashboard from "@/components/admin/Dashboard.jsx";

const tabs = [
  { label: "Dashboard", valor: "dashboard", Componente: Dashboard },
  { label: "Agregar Item", valor: "agregar", Componente: AgregarItem },
];

import { useAuth } from "@/context/useAuth";

export default function Admin() {
  const { usuario } = useAuth();

  const [tabActivo, setTabActivo] = useState("dashboard");

  const tabSeleccionado = tabs.find((tab) => tab.valor === tabActivo);
  const ComponenteActivo = tabSeleccionado.Componente;

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== "admin") return <Navigate to="/" replace />;

  return (
    <div>
      <h1 className="text-4xl font-black text-white mb-5 flex items-center gap-2">
        <Cog className="w-8 h-8" /> Admin Panel
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
