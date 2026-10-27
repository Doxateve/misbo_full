export async function obtenerItems() {
  const res = await fetch("/api/mcItems/", { credentials: "include" });

  // Convierte la response en json
  const data = await res.json();

  // Si no devuelve 200 OK
  if (!res.ok) {
    throw new Error(data.message);
  }

  // Deveulve los items
  return data.items;
}

export async function obtenerDashboard() {
  const res = await fetch("/api/admin/dashboard", { credentials: "include" });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.dashboard;
}

export async function agregarItem(
  imagenUrl,
  mcItem,
  nombre,
  descripcion,
  precio,
  stock,
) {
  const res = await fetch("/api/admin/agregar", {
    method: "POST",
    // Dice que envia un body en json
    headers: { "Content-Type": "application/json" },
    // Incluye las cookies
    credentials: "include",
    body: JSON.stringify({
      imagenUrl,
      nombre,
      mcItem,
      descripcion,
      precio,
      stock,
    }),
  });

  // Convierte la response en json
  const data = await res.json();

  // Si no devuelve 200 OK
  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.message;
}

export async function obtenerInventarioBot() {
  const res = await fetch("/api/admin/inventario-bot", { credentials: "include" });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.inventario;
}
