import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Hash,
  Box,
  HandCoins,
  ListOrdered,
  Calendar,
  CircleDollarSign,
} from "lucide-react";

import LoadingPage from "@/pages/LoadingPage";

import { comprasPerfil } from "@/services/usuario.services";

export default function ComprasPerfil() {
  const [cargando, setCargando] = useState(true);
  const [compras, setCompras] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    comprasPerfil()
      .then(setCompras)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <LoadingPage />;
  if (error) return <p>{error}</p>;

  const total = compras?.reduce(
    (acumulador, compra) => acumulador + compra.total,
    0,
  );

  return (
    <div>
      <div className=" [&>div]:max-h-[63vh] border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className={"sticky top-0 h-14 bg-[#0F0F11]"}>
            <TableRow className={"sticky top-0 hover:bg-[#0F0F11]"}>
              <TableHead className={"font-extrabold text-zinc-300"}>
                <span className="flex flex-row gap-1 items-center">
                  <Hash className="w-4 h-4" />
                  Id
                </span>
              </TableHead>
              <TableHead className={"w-md font-extrabold text-zinc-300"}>
                <span className="flex flex-row gap-1 items-center">
                  <Box className="w-4 h-4" />
                  Producto
                </span>
              </TableHead>
              <TableHead className={"font-extrabold text-center text-zinc-300"}>
                <span className="flex flex-row gap-1 items-center justify-center">
                  <HandCoins className="w-4 h-4" />
                  Precio
                </span>
              </TableHead>
              <TableHead className={"font-extrabold text-center text-zinc-300"}>
                <span className="flex flex-row gap-1 items-center justify-center">
                  <ListOrdered className="w-4 h-4" />
                  Cantidad
                </span>
              </TableHead>
              <TableHead className={"font-extrabold text-center text-zinc-300"}>
                <span className="flex flex-row gap-1 items-center justify-center">
                  <Calendar className="w-4 h-4" />
                  Fecha
                </span>
              </TableHead>
              <TableHead className={"font-extrabold text-right text-zinc-300"}>
                <span className="flex flex-row gap-1 items-center justify-end">
                  <CircleDollarSign className="w-4 h-4" />
                  Total
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compras.map((compra) => {
              const fechaCompra = new Date(compra.createdAt).toLocaleDateString(
                // Para que la fecha sea xx-xx-xx en vez de xx/xx/xx usar locale de NL
                "nl-NL",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                },
              );

              return (
                <TableRow
                  key={compra.id}
                  className={"*:border-border [&>:not(:last-child)]:border-r"}
                >
                  <TableCell>{compra.id}</TableCell>
                  <TableCell>
                    <Link
                      className="underline underline-offset-1"
                      to={`/productos/${compra.producto.id}`}
                    >
                      {compra.producto.nombre}
                    </Link>
                    <span className="text-zinc-500 text-sm">
                      {" "}
                      para <span className="text-zinc-400 font-bold">{compra.usernameComprador}</span>
                    </span>
                  </TableCell>
                  <TableCell className={"text-center"}>
                    ${compra.producto.precio}
                  </TableCell>
                  <TableCell className={"text-center"}>
                    {compra.cantidad}
                  </TableCell>
                  <TableCell className={"text-center"}>{fechaCompra}</TableCell>
                  <TableCell className={"text-right font-semibold"}>
                    ${compra.total}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter className={"sticky bottom-0 bg-[#171718]"}>
            <TableRow className={"sticky bottom-0 hover:bg-[#171718]"}>
              <TableCell className={"font-extrabold text-zinc-300"} colSpan={5}>
                Total
              </TableCell>
              <TableCell className="text-right font-semibold">
                ${total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
