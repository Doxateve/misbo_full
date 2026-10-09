import { useState, useEffect, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";

import {
  Field,
  FieldDescription,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupButton,
  InputGroupText,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

import { Ellipsis, Minus, Plus } from "lucide-react";

import { obtenerItems } from "@/services/admin.services.js";
import LoadingPage from "@/pages/LoadingPage";

function AgregarItem() {
  const [cargando, setCargando] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState(0);
  const [precio, setPrecio] = useState(0)

  const [busqueda, setBusqueda] = useState("");

  const [customName, setCustomName] = useState(false);

  useEffect(() => {
    obtenerItems()
      .then(setItems)
      .catch((err) => setError(err))
      .finally(() => setCargando(false));
  }, []);

  const itemsFiltrados = useMemo(() => {
    if (!busqueda) return items;

    if (itemSeleccionado && itemSeleccionado.mcItem === busqueda) return items;

    return items.filter((item) =>
      item.mcItem.toLowerCase().includes(busqueda.toLowerCase()),
    );
  }, [items, busqueda, itemSeleccionado]);

  const handleSeleccionar = (item) => {
    if (item) {
      setItemSeleccionado(item);
      setBusqueda(item.mcItem);
    }
  };

  if (cargando) return <LoadingPage />;

  if (error)
    return <p style={{ color: "red" }}>Error a la hora de cargar los Items.</p>;

  return (
    <div className="p-2">
      <form action="">
        <FieldGroup className="space-y-4">
          <FieldGroup className="grid grid-cols-[1fr_2.894fr]">
            <Field>
              <div className="w-[234.75px] h-[234.75px] bg-[#151517] rounded-lg flex items-center justify-center">
                {itemSeleccionado ? (
                  <img
                    src={itemSeleccionado.imgSrc}
                    alt={itemSeleccionado.mcItem}
                    className="w-20 h-20 object-contain"
                    // IMPORTANTE PARA QUE LA IMAGEN SE RENDERICE EN PIXELES
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <Ellipsis className="w-10 h-10 text-[#A2A2A3]" />
                )}
              </div>
            </Field>
            <FieldGroup className="ml-5 grid grid-rows-2">
              <Field>
                <FieldLabel htmlFor="mcItem">
                  <span className="font-bold">Nombre del Item</span>
                  <span className="text-zinc-400">(mcItem)</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Combobox
                  onValueChange={handleSeleccionar}
                  items={itemsFiltrados}
                  itemToStringValue={(item) => item.nombre}
                >
                  <ComboboxInput
                    required
                    id="mcItem"
                    className="w-12 h-12 p-3"
                    placeholder="Buscar Item..."
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      if (itemSeleccionado) setItemSeleccionado(null);
                    }}
                  />
                  <ComboboxContent>
                    {itemsFiltrados.length === 0 && (
                      <ComboboxEmpty>No se encontraron items.</ComboboxEmpty>
                    )}
                    <ComboboxList className="h-62 overflow-hidden">
                      <Virtuoso
                        style={{ height: "248px" }} // h-62
                        data={itemsFiltrados} // Pasamos el array completo
                        itemContent={(index, item) => (
                          // Virtuoso se encarga de renderizar solo lo visible en el viewport
                          <ComboboxItem key={item.mcItem} value={item}>
                            <Item size="xs" className="p-0">
                              <ItemContent>
                                <ItemTitle className="whitespace-nowrap">
                                  {item.nombre}
                                </ItemTitle>
                                <ItemDescription>{item.mcItem}</ItemDescription>
                              </ItemContent>
                            </Item>
                          </ComboboxItem>
                        )}
                      />
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <Field>
                <FieldLabel htmlFor="nombre">
                  <span className="font-bold">Nombre visible</span>
                  <span className="text-zinc-400">(Display Name)</span>
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <InputGroup className="w-12 h-12 p-3">
                  <InputGroupInput
                    required
                    autoComplete="off"
                    placeholder="Nombre del Item"
                    disabled={!customName}
                    value={
                      itemSeleccionado
                        ? customName
                          ? nombre
                          : itemSeleccionado.nombre
                        : ""
                    }
                    onChange={(e) => customName && setNombre(e.target.value)}
                    id="nombre"
                    type="text"
                  />
                </InputGroup>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  checked={itemSeleccionado ? customName : false}
                  disabled={!itemSeleccionado}
                  onCheckedChange={itemSeleccionado ? setCustomName : null}
                  id="customName"
                  name="customName"
                />
                <FieldContent>
                  <FieldLabel
                    className={!itemSeleccionado ? "text-[#6F6F70]" : ""}
                    htmlFor="customName"
                  >
                    Nombre personalizado
                  </FieldLabel>
                  <FieldDescription
                    className={!itemSeleccionado ? "text-[#4D4D4E]" : ""}
                  >
                    Le podrás poner al item un nombre personalizado.
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel className="font-bold">
                Stock <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup className="w-12 h-12 p-3">
                <InputGroupAddon align="inline-start">
                  <InputGroupButton
                    disabled={!itemSeleccionado || stock === 0}
                    variant="default"
                    size="icon-xs"
                    onClick={() => (stock === 0 ? "" : setStock(stock - 1))}
                  >
                    <Minus />
                  </InputGroupButton>
                </InputGroupAddon>
                <InputGroupInput
                  required
                  value={itemSeleccionado ? stock : 0}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={!itemSeleccionado}
                  className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  min="1"
                  autoComplete="off"
                  placeholder="Stock del item"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    disabled={!itemSeleccionado}
                    variant="default"
                    onClick={() => setStock(stock + 1)}
                    size="icon-xs"
                  >
                    <Plus />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel className="font-bold">
                Precio <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup className="w-12 h-12 p-3">
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  required
                  disabled={!itemSeleccionado}
                  type="number"
                  step="any"
                  min="0"
                  value={itemSeleccionado ? precio > 0 && precio : ""}
                  onChange={(e) => setPrecio(e.target.value)}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoComplete="off"
                  placeholder="0.000"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>COP</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <FieldLabel htmlFor="descripcion" className="font-bold">
              Descripcion
            </FieldLabel>
            <InputGroup className="p-3">
              <InputGroupTextarea
                disabled={!itemSeleccionado}
                id="descripcion"
                placeholder="Escribe aqui una breve descripción para el Item."
                className="min-h-50"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </InputGroup>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  );
}

export default AgregarItem;
