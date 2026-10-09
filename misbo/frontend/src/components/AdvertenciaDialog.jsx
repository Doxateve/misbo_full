import { Save, Pencil, Pickaxe } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { InputGroupButton } from "@/components/ui/input-group";

export default function AdvertenciaDialog({
  editarUsername,
  editandoUsername,
}) {
  if (editandoUsername)
    return (
      <InputGroupButton
        className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.35)] text-white p-2.5 text-xs font-semibold"
        variant="default"
        id="editarUsuario"
        onClick={editarUsername}
        type="button"
      >
        Guardar
        <Save className="w-3.5 h-3.5" />
      </InputGroupButton>
    );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <InputGroupButton
          className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.35)] text-white p-2.5 text-xs font-semibold"
          variant="default"
          id="editarUsuario"
          type="button"
        >
          Editar
          <Pencil className="w-3.5 h-3.5" />
        </InputGroupButton>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Pickaxe />
          </AlertDialogMedia>
          <AlertDialogTitle className={"font-extrabold text-xl"}>
            ¡Advertencia!
          </AlertDialogTitle>
          <AlertDialogDescription>
            El nombre de usuario de tu cuenta{" "}
            <span className="font-bold">SIEMPRE</span> debe ser el mismo que tu
            username de Minecraft.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={
              "bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.35)] text-white"
            }
            onClick={editarUsername}
          >
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
