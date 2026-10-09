import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { register } from "../services/auth.services";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  UserRoundPlus,
  UserRound,
  Pickaxe,
  Mail,
  KeyRound,
  AlertCircleIcon,
  CheckCircle2Icon,
  Asterisk,
  X,
} from "lucide-react";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");

  const [response, setResponse] = useState(null);
  // Arranca con que el mensaje no es error
  const [esError, setEsError] = useState(false);

  const navigate = useNavigate();

  const { cargando, usuario } = useAuth();

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
    // Hace que no haya ninguna response al comenzar el envio del form
    setResponse(null);

    if(contraseña !== confirmarContraseña) {
        setEsError(true)
        return setResponse("Las contraseñas no coinciden")
    }

    try {
      const message = await register(nombre, username, email, contraseña);
      // Limpia los datos
      setNombre("");
      setUsername("");
      setEmail("");
      setContraseña("");
      // Envia la respuesta
      setResponse(message);
      setEsError(false);
    } catch (error) {
      // Si hay error, hace que el mensaje sea error
      setEsError(true);
      // Setea en la response el mensaje de error
      setResponse(error.message);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-4xl">
        <h1></h1>

        <h1 className="text-4xl font-black text-white mb-1 flex items-center gap-2">
          <UserRoundPlus className="w-8 h-8" />
          Registrarse
        </h1>
        <p className="text-md text-zinc-500 mb-6">
          Registra una cuenta en <span className="font-bold">MISBO</span> para
          poder comprar en la tienda
        </p>
        <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-10">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="nombre" className="text-md font-bold">
                  Nombre
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup className="w-12 h-12 p-3">
                  <InputGroupInput
                    required
                    id="nombre"
                    type="text"
                    placeholder="Nombre visible"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <UserRound className="w-14 h-14" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="username" className="text-md font-bold">
                  Nombre de usuario
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup className="w-12 h-12 p-3">
                  <InputGroupInput
                    required
                    id="username"
                    type="text"
                    placeholder="Username de Minecraft"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <Pickaxe className="w-14 h-14" />
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  <span className="font-extrabold">¡OJO!</span> El nombre de
                  usuario debe de ser el mismo que tu usuario de Minecraft
                </FieldDescription>
              </Field>
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
                    placeholder="Correo electronico"
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
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="confirmar-contraseña"
                  className="text-md font-bold"
                >
                  Confirmar contraseña
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup className="w-12 h-12 p-3">
                  <InputGroupInput
                    required
                    id="confirmar-contraseña"
                    type="password"
                    placeholder="••••••••••"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    <Asterisk className="w-14 h-14" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                {response && (
                  <Alert
                    className="animate-in fade-in duration-200"
                    variant={esError ? "destructive" : "default"}
                  >
                    {esError ? (
                      <AlertCircleIcon className="w-6! h-6!" />
                    ) : (
                      <CheckCircle2Icon className="w-6! h-6!" />
                    )}
                    <AlertTitle className="text-lg font-extrabold">
                      {esError ? "Error" : "Mensaje"}
                    </AlertTitle>
                    <AlertDescription className="text-base font-semibold">
                      {response}
                    </AlertDescription>
                    <button
                      onClick={() => setResponse("")}
                      className="absolute top-3 right-3 text-zinc-500 hover:text-white"
                    >
                      <X className="w-6! h-6!" />
                    </button>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] mt-4 p-7 text-lg font-black"
                >
                  Registrarse
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-zinc-500 text-md text-center mt-4">
            ¿Ya tienes una cuenta?
            <Link
              to="/login"
              className="text-purple-400 font-medium hover:text-purple-300 ml-1"
            >
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
