import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Checkbox } from "@/components/ui/checkbox";

import { Spinner } from "@/components/ui/spinner";

import {
  AlertCircleIcon,
  CheckCircle2Icon,
  Pickaxe,
  Package,
  X
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../context/useAuth";

import { comprarItems } from "../services/compras.services";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CarritoDialog({
  items,
  vaciarCarrito,
  total,
  procesando,
  setProcesando,
}) {
  const { usuario } = useAuth();

  const navigate = useNavigate();

  const [checked, setChecked] = useState(usuario ? false : true);
  const [username, setUsername] = useState(usuario?.username ?? "");
  const [response, setResponse] = useState("");
  const [esError, setEsError] = useState(false);

  function checkearUsuario(e) {
    setChecked(e);
    setUsername(!e ? (usuario?.username ?? "") : "");
  }

  async function comprarObjetos(e) {
    e.preventDefault();
    setResponse("");
    setProcesando(true);

    if (usuario) {
      try {
        const itemsParaBackend = items.map((item) => ({
          itemName: item.nombre,
          cantidad: item.cantidad,
        }));

        const respuesta = await comprarItems(username, itemsParaBackend);
        setResponse(respuesta);
        setEsError(false);
        setTimeout(() => vaciarCarrito(), 30000);
      } catch (err) {
        setResponse(err.message);
        setEsError(true);
      } finally {
        setProcesando(false);
      }
    } else {
      navigate("/login");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] p-5">
          Comprar
        </Button>
      </DialogTrigger>
      <DialogContent className="p-7 max-h-[85vh] no-scrollbar overflow-y-auto">
        <form
          autoComplete="off"
          onSubmit={comprarObjetos}
          className="mt-4 space-y-3"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Package /> Entrega
            </DialogTitle>
            <DialogDescription>
              ¡Muchas gracias por comprar en{" "}
              <span className="font-bold">MISBO</span>! <br />
              Antes de terminar tu compra, necesitamos confirmar algunos
              detalles de entrega:
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="mt-8 mb-6">
            <div className="space-y-3">
              <Field>
                <FieldLabel htmlFor="username">
                  Nombre de usuario
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <FieldDescription>
                  <span className="font-bold">Debes</span> de estar conectado en
                  el servidor
                </FieldDescription>
                <InputGroup>
                  <InputGroupInput
                    required
                    placeholder="Username de Minecraft"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={procesando || !checked}
                  />
                  <InputGroupAddon align="inline-end">
                    <Pickaxe />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              {usuario ? (
                <Field orientation="horizontal">
                  <Checkbox
                    disabled={false}
                    onCheckedChange={checkearUsuario}
                    checked={checked}
                    id="username-default"
                    name="username-default"
                  />
                  <FieldLabel htmlFor="username-default">
                    Entregar a otro usuario
                  </FieldLabel>
                </Field>
              ) : (
                ""
              )}
            </div>
          </FieldGroup>

          <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-3.5">
            <p className="text-zinc-500 text-[11px] font-semibold tracking-wide mb-2">
              SE TE ENTREGARA
            </p>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between mb-1 last:mb-0"
              >
                <span className="text-zinc-300 text-sm">
                  {item.nombre}{" "}
                  <span className="text-xs">x{item.cantidad}</span>
                </span>
                <span className="text-zinc-400 text-sm">
                  ${item.precio * item.cantidad}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-purple-500/10 mt-2 pt-2">
              <span className="text-white text-sm font-semibold">Total</span>
              <span className="text-purple-400 text-sm font-semibold">
                ${total}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-5 sm:justify-center sm:flex-col">
            {response && (
              <Alert
                variant={esError ? "destructive" : "default"}
                className="mb-1"
              >
                {esError ? <AlertCircleIcon /> : <CheckCircle2Icon />}
                <AlertTitle className="font-extrabold">{esError ? "Error" : "Mensaje"}</AlertTitle>
                <AlertDescription className="font-semibold">{response}</AlertDescription>
                <button
                  onClick={() => setResponse("")}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </Alert>
            )}
            <Button
              type="submit"
              disabled={procesando || (response && !esError)}
              className=" bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_14px_rgba(168,85,247,0.4)] p-5"
            >
              {procesando ? (
                <>
                  <Spinner />
                  Entregando compra...
                </>
              ) : response && !esError ? (
                "Compra entregada!"
              ) : (
                "Finalizar la compra"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
