import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import {
  Pickaxe,
  Mail,
  Calendar,
  SquareChartGantt,
  SquarePen,
  SaveCheck,
} from "lucide-react";

import LoadingPage from "@/pages/LoadingPage";

import { obtenerPerfil, editarPerfil } from "@/services/usuario.services";

export default function VerPerfil() {
  const [perfil, setPerfil] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [editando, setEditando] = useState(false);

  const descripcionRef = useRef(null)

  useEffect(() => {
    if(!perfil) {
      obtenerPerfil()
        .then((perfil) => {
          setPerfil(perfil);
          setDescripcion(perfil.descripcion);
        })
        .catch((err) => setError(err.message))
        .finally(() => setCargando(false));
    }

    if(editando) {
      descripcionRef.current?.focus();
    }

  }, [perfil, editando, descripcionRef]);

  async function editar(e) {
    e.preventDefault();
    if (editando === true) {
      return setEditando(false);
    }

    try {
      await editarPerfil({
        descripcion: descripcion,
      });
      setEditando(false);
    } catch (e) {
      setError(e);
    }
  }

  if (cargando) return <LoadingPage />;

  if (error) return <p>{error}</p>;

  const fechaRegistro = new Date(perfil.createdAt).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-lg mx-auto p-2">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-[0_0_16px_rgba(168,85,247,0.4)]"></div>
        <p className="text-white text-3xl font-black">{perfil.nombre}</p>
        <p className="text-zinc-500 text-base mt-1">{perfil.email}</p>
      </div>

      <div className="border-t border-purple-500/10 pt-5 flex flex-col gap-3.5">
        <div className="flex justify-between">
          <span className="text-zinc-500 text-sm font-bold flex items-center gap-x-1.5">
            <Pickaxe className="w-3.5 h-3.5" />
            Nombre de usuario
          </span>
          <span className="text-zinc-300 text-sm font-medium">
            {perfil.username}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500 text-sm font-bold flex items-center gap-x-1.5">
            <Mail className="w-3.5 h-3.5" />
            Correo
          </span>
          <span className="text-zinc-300 text-sm font-medium">
            {perfil.email}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500 text-sm font-bold flex items-center gap-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Miembro desde
          </span>
          <span className="text-zinc-300 text-sm font-medium capitalize">
            {fechaRegistro}
          </span>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3.5">
        <span className="text-zinc-500 text-sm font-bold flex items-center gap-x-1.5">
          <SquareChartGantt className="w-3.5 h-3.5" />
          Descripcion
        </span>
        <div className="relative">
          {editando === false ? (
            <>
              <textarea
                name="descripcion"
                id="descripcion"
                value={
                  descripcion === "" || descripcion === null
                    ? "No tienes descripcion"
                    : descripcion
                }
                disabled={!editando}
                className={`field-sizing-content resize-none w-full min-h-52 pb-16 bg-zinc-900 border border-purple-500/15 rounded-xl p-4 text-sm ${descripcion === "" || descripcion === null ? "text-zinc-500 italic" : "text-zinc-300"}`}
              ></textarea>
              <Button
                onClick={setEditando}
                className="font-semibold absolute bottom-5 right-4 flex items-center bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] p-4"
              >
                <SquarePen />
                Editar
              </Button>
            </>
          ) : (
            <form onSubmit={editar}>
              <textarea
                name="descripcion"
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                ref={descripcionRef}
                disabled={!editando}
                className="field-sizing-content resize-none w-full min-h-52 pb-16 bg-zinc-900 border border-purple-500/15 rounded-xl p-4 text-sm text-zinc-300"
              ></textarea>
              <Button
                type="submit"
                className="font-semibold absolute bottom-5 right-4 flex items-center bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] p-4"
              >
                <SaveCheck />
                Guardar
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
