// src/components/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import LoadingPage from "@/pages/LoadingPage";
import { obtenerDashboard } from "@/services/admin.services.js";

const configMes = {
  total: {
    label: "Ingresos",
    color: "#a855f7",
  },
  unidades: {
    label: "Unidades vendidas",
    color: "#38bdf8",
  },
};

const configTipo = {
  total: { label: "Ventas" },
  ITEM: { label: "Items", color: "#a855f7" },
  KIT: { label: "Kits", color: "#c084fc" },
  ROL: { label: "Roles", color: "#fb923c" },
};

const configVendidos = {
  cantidad: { label: "Unidades", color: "#a855f7" },
};

// "2026-07" -> "jul 26"
const nombreMes = (mes) =>
  new Date(`${mes}-01T12:00:00`).toLocaleDateString("es-ES", {
    month: "short",
    year: "2-digit",
  });

function SinDatos() {
  return (
    <div className="h-52 flex items-center justify-center text-sm text-zinc-500">
      Aún no hay datos
    </div>
  );
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDashboard()
      .then(setDashboard)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <LoadingPage />;
  if (error) return <p className="text-red-400 text-sm">{error}</p>;

  const { resumen, ventasPorMes, ventasPorTipo, masVendidos } = dashboard;

  console.log(dashboard)

  const stats = [
    { label: "Ingresos", valor: `$${resumen.ingresos.toLocaleString()}` },
    { label: "Compras", valor: resumen.pedidos },
    { label: "Productos", valor: resumen.productos },
  ];

  // cada porción del donut toma el color de su tipo
  const datosTipo = ventasPorTipo.map((dato) => ({
    ...dato,
    fill: `var(--color-${dato.tipo})`,
  }));

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-5">Resumen de ventas</h2>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {stats.map(({ label, valor }) => (
          <div
            key={label}
            className="bg-zinc-900 border border-purple-500/15 rounded-xl px-5 py-4"
          >
            <p className="text-xs text-zinc-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{valor}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-5 mb-4">
        <p className="text-sm font-semibold text-white mb-3.5">
          Ventas por mes
        </p>
        {ventasPorMes.length === 0 ? (
          <SinDatos />
        ) : (
          <ChartContainer
            config={configMes}
            className="aspect-auto h-52 w-full"
          >
            <LineChart
              data={ventasPorMes}
              margin={{ top: 8, left: 4, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={nombreMes}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={56}
                tickFormatter={(valor) => `$${valor.toLocaleString()}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent labelFormatter={nombreMes} />}
              />
              <Line
                dataKey="total"
                type="monotone"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-total)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-3.5">
            Ventas por tipo
          </p>
          {datosTipo.length === 0 ? (
            <SinDatos />
          ) : (
            <ChartContainer
              config={configTipo}
              className="aspect-auto h-52 w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="tipo" hideLabel />}
                />
                <Pie
                  data={datosTipo}
                  dataKey="total"
                  nameKey="tipo"
                  innerRadius={40}
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent nameKey="tipo" />} />
              </PieChart>
            </ChartContainer>
          )}
        </div>

        <div className="bg-zinc-900 border border-purple-500/15 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-3.5">
            Productos más vendidos
          </p>
          {masVendidos.length === 0 ? (
            <SinDatos />
          ) : (
            <ChartContainer
              config={configVendidos}
              className="aspect-auto h-52 w-full"
            >
              <BarChart
                data={masVendidos}
                layout="vertical"
                margin={{ left: 8 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="nombre"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <XAxis type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="cantidad"
                  fill="var(--color-cantidad)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
