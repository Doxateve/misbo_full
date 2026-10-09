export async function obtenerPerfil() {
  const res = await fetch("/api/usuario/perfil", { credentials: "include" });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.usuario;
}

export async function editarPerfil({ imagenUrl, nombre, descripcion }) {
  const res = await fetch("/api/usuario/editarPerfil", {
    method: "PATCH",
    // Dice que envia un body en json
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ imagenUrl, nombre, descripcion }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function editarCuenta({ nombre, username, email, contraseña }) {
  const res = await fetch("/api/usuario/editarCuenta", {
    method: "PATCH",
    // Dice que envia un body en json
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ nombre, username, email, contraseña })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function comprasPerfil() {
  const res = await fetch("/api/usuario/compras", { credentials: "include" });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data.compras;
}
