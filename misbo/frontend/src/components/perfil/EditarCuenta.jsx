import { useState, useEffect, useRef } from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Pickaxe,
  Pencil,
  Mail,
  KeyRound,
  UserRound,
  Save,
  Eye,
  EyeOff,
  AlertCircleIcon,
  X,
} from "lucide-react";

import { obtenerPerfil, editarCuenta } from "@/services/usuario.services";

import LoadingPage from "@/pages/LoadingPage";

import AdvertenciaDialog from "../AdvertenciaDialog";

export default function EditarCuenta() {
  const [modificados, setModificados] = useState([]);

  const [perfilOg, setPerfilOg] = useState(null);
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState(undefined);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [editandoUsername, setEditandoUsername] = useState(false);
  const [editandoContraseña, setEditandoContraseña] = useState(false);

  const [verContraseña, setVerContraseña] = useState(false);

  const [limpiarContraseña, setLimpiarContraseña] = useState(false);

  const [respuesta, setRespuesta] = useState("");
  const [esError, setEsError] = useState(false);

  const usernameRef = useRef(null);
  const contraseñaRef = useRef(null);

  useEffect(() => {
    if (!perfilOg) {
      obtenerPerfil()
        .then((perfil) => {
          setPerfilOg(perfil);
          setModificados([]);
          setNombre(perfil.nombre);
          setUsername(perfil.username);
          setEmail(perfil.email);
          setContraseña(undefined);
        })
        .catch((err) => setError(err.message))
        .finally(() => setCargando(false));
    }

    if (editandoContraseña) {
      contraseñaRef.current?.focus();
    } else if (editandoUsername) {
      usernameRef.current?.focus();
    }
  }, [
    respuesta,
    perfilOg,
    editandoContraseña,
    contraseñaRef,
    editandoUsername,
    usernameRef,
  ]);

  function editarUsername() {
    if (editandoUsername === true) {
      return setEditandoUsername(false);
    }

    return setEditandoUsername(true);
  }

  function editarContraseña() {
    setLimpiarContraseña(false);

    if (editandoContraseña === true) {
      setVerContraseña(false);
      return setEditandoContraseña(false);
    }

    return setEditandoContraseña(true);
  }

  function funcionLimpiar() {
    if (!limpiarContraseña) {
      setContraseña("");
      setModificados((prevModificados) =>
        prevModificados.filter((campo) => campo !== "contraseña"),
      );
      return setLimpiarContraseña(true);
    }
  }

  function añadirModificados(e) {
    if (!modificados.includes(e.target.id)) {
      return setModificados((prevModificados) => [
        ...(prevModificados || []),
        e.target.id,
      ]);
    }

    if (e.target.value === perfilOg[e.target.id] || e.target.value === "") {
      setModificados((prevModificados) =>
        prevModificados.filter((campo) => campo !== e.target.id),
      );
    }
  }

  async function guardarCambios(e) {
    e.preventDefault(e);

    setModificados([]);
    try {
      const res = await editarCuenta({
        nombre,
        username,
        email,
        contraseña,
      });

      return setRespuesta(res.message);
    } catch (err) {
      setEsError(true);
      return setRespuesta(err.message);
    }
  }

  if (cargando) return <LoadingPage />;

  if (error) return <p>{error}</p>;

  return (
    <div className="p-2">
      <form onSubmit={guardarCambios}>
        <FieldGroup className="space-y-4">
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel
                htmlFor="nombre"
                className="text-zinc-300 text-md font-bold"
              >
                <UserRound className="w-4 h-4" />
                Nombre
              </FieldLabel>
              <InputGroup className="w-12 h-12 p-3">
                <InputGroupInput
                  required
                  id="nombre"
                  type="text"
                  autoComplete="off"
                  placeholder="Nombre visible"
                  onChange={(e) => {
                    setNombre(e.target.value);
                    añadirModificados(e);
                  }}
                  value={nombre}
                />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel
                htmlFor="username"
                className="text-zinc-300 text-md font-bold"
              >
                <Pickaxe className="w-4 h-4" />
                Nombre de usuario
              </FieldLabel>
              <InputGroup className="w-12 h-12 p-3">
                <InputGroupInput
                  required
                  disabled={!editandoUsername}
                  id="username"
                  ref={usernameRef}
                  autoComplete="off"
                  type="text"
                  placeholder="Nombre visible"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    añadirModificados(e);
                  }}
                  value={username}
                />
                <AdvertenciaDialog
                  editarUsername={editarUsername}
                  editandoUsername={editandoUsername}
                />
              </InputGroup>
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="correo"
              className="text-zinc-300 text-md font-bold"
            >
              <Mail className="w-4 h-4" />
              Correo
            </FieldLabel>
            <InputGroup className="w-12 h-12 p-3">
              <InputGroupInput
                required
                id="correo"
                type="correo"
                autoComplete="off"
                placeholder="Nombre visible"
                onChange={(e) => {
                  setEmail(e.target.value);
                  añadirModificados(e);
                }}
                value={email}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel
              htmlFor="contraseña"
              className="text-zinc-300 text-md font-bold"
            >
              <KeyRound className="w-4 h-4" />
              Contraseña
            </FieldLabel>
            <InputGroup className="w-12 h-12 p-3 mb-5">
              <InputGroupInput
                required
                id="contraseña"
                autoComplete="off"
                type={!verContraseña ? "password" : "text"}
                placeholder="••••••••••"
                ref={contraseñaRef}
                disabled={!editandoContraseña}
                onChange={(e) => {
                  setContraseña(e.target.value);
                  añadirModificados(e);
                }}
                onFocus={() => {
                  funcionLimpiar();
                }}
                value={contraseña === undefined ? "••••••••••" : contraseña}
              />
              {editandoContraseña ? (
                <Button
                  id="verContraseña"
                  size="icon"
                  type="button"
                  variant="outline"
                  className="rounded-full w-8! h-8! mr-1"
                  onClick={() => {
                    if (verContraseña) {
                      return setVerContraseña(false);
                    }
                    setVerContraseña(true);
                  }}
                >
                  {verContraseña ? (
                    <EyeOff className="w-4! h-4!" />
                  ) : (
                    <Eye className="w-4! h-4!" />
                  )}
                </Button>
              ) : (
                ""
              )}
              <InputGroupButton
                className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.35)] text-white p-2.5 text-xs font-semibold"
                variant="default"
                type="button"
                id="editarContraseña"
                onClick={editarContraseña}
              >
                {editandoContraseña ? (
                  <>
                    Guardar
                    <Save className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Editar
                    <Pencil className="w-3.5 h-3.5" />
                  </>
                )}
              </InputGroupButton>
            </InputGroup>
          </Field>
          {respuesta && (
            <Alert
              className="animate-in fade-in duration-200"
              variant={esError ? "destructive" : "default"}
            >
              <AlertCircleIcon className="w-6! h-6!" />
              <AlertTitle className="text-lg font-extrabold">
                {esError ? "Error" : "Mensaje"}
              </AlertTitle>
              <AlertDescription className="text-base font-semibold">
                {respuesta}
              </AlertDescription>
              <button
                onClick={() => setRespuesta("")}
                className="absolute top-3 right-3 text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </Alert>
          )}
          <Field>
            <Button
              id="guardar"
              disabled={
                !modificados.length >= 1 ||
                editandoUsername ||
                editandoContraseña
              }
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] p-7 text-lg font-extrabold"
            >
              Guardar
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
