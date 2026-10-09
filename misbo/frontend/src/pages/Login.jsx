import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Checkbox } from "@/components/ui/checkbox";

import { Mail, KeyRound, AlertCircleIcon, LogIn, X } from "lucide-react";

import { useAuth } from "../context/useAuth";
import { login } from "../services/auth.services";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { cargando, usuario, setUsuario } = useAuth();

  // Hace lo siguiente cuando cambia cargando, usuario o navigate (cuando se usa)
  useEffect(() => {
    // Hace lo siguiente si no está cargando y hay un usuario
    if (!cargando && usuario) {
      navigate("/");
    }
  }, [cargando, usuario, navigate]); // cuando cambian estos datos, se ejecuta el useEffect()

  // La funcion que se ejecuta al enviar un form
  async function handleSubmit(e) {
    // Para evitar envios erroneos del form
    e.preventDefault();
    // Hace que no haya ningun error al comenzar el envio del form
    setError("");

    try {
      const usuario = await login(email, contraseña, recordarme);
      // Setea el usuario entregado por el login de una vez para no tener que hacer un fetch adicional
      setUsuario(usuario);
      // Carga el componente "/" sin actualizar como tal, por eso se tiene que setear el usuario
      return navigate("/");
    } catch (error) {
      setContraseña("");
      return setError(error.message);
    }
  }

  return (
    <div className="flex justify-center ">
      <div className="w-4xl">
        <h1 className="text-4xl font-black text-white mb-1 flex items-center gap-2">
          <LogIn className="w-8 h-8" />
          Iniciar Sesion
        </h1>
        <p className="text-md text-zinc-500 mb-6">
          Ingresa con tu cuenta para poder comprar en la tienda
        </p>
        <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-10">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email" className="text-md font-bold">
                  Email
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup className="w-12 h-12 p-3">
                  <InputGroupInput
                    required
                    id="email"
                    type="email"
                    placeholder="Correo con el que te registraste"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <Mail className="w-14 h-14" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="contraseña" className="text-md font-bold">
                  Contraseña
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup className="w-12 h-12 p-3">
                  <InputGroupInput
                    required
                    id="contraseña"
                    type="password"
                    placeholder="••••••••••"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <KeyRound className="w-14 h-14" />
                  </InputGroupAddon>
                </InputGroup>
                <div className="flex items-center justify-between mt-2">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="recordarme"
                      checked={recordarme}
                      onCheckedChange={setRecordarme}
                    />
                    <FieldLabel htmlFor="recordarme" className=" text-zinc-400">
                      Recordarme
                    </FieldLabel>
                  </Field>
                  <Link
                    to="/recuperar-contraseña"
                    className="text-sm text-purple-400 hover:text-purple-300 whitespace-nowrap"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </Field>
              <Field>
                {error && (
                  <Alert
                    className="animate-in fade-in duration-200"
                    variant="destructive"
                  >
                    <AlertCircleIcon className="w-6! h-6!" />
                    <AlertTitle className="text-lg font-extrabold">
                      Error
                    </AlertTitle>
                    <AlertDescription className="text-base font-semibold">
                      {error}
                    </AlertDescription>
                    <button
                      onClick={() => setError("")}
                      className="absolute top-3 right-3 text-zinc-500 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] mt-4 p-7 text-lg font-black"
                >
                  Entrar
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-zinc-500 text-md text-center mt-4">
            ¿No tienes cuenta?
            <Link
              to="/register"
              className="text-purple-400 font-medium hover:text-purple-300 ml-1"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
