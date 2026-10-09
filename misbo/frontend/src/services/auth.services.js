export async function register(nombre, username, email, contraseña) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        // Dice que envia un body en json
        headers: { 'Content-Type': 'application/json' },
        // Incluye las cookies
        credentials: 'include',
        body: JSON.stringify({
            nombre,
            username,
            email,
            contraseña
        })
    });

    // Convierte la response en json
    const data = await res.json()

    // Si no devuelve 200 OK
    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.message
}

export async function login(email, contraseña, recordarme) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        // Dice que envia un body en json
        headers: { 'Content-Type': 'application/json' },
        // Incluye las cookies
        credentials: 'include',
        body: JSON.stringify({ email, contraseña, recordarme })
    });

    // Convierte la response en json
    const data = await res.json()

    // Si no devuelve 200 OK
    if (!res.ok) {
        throw new Error(data.message)
    }

    return data.usuario
};

export async function usuarioActual() {
    const res = await fetch('/api/usuario/yo', { credentials: 'include' });

    // Convierte la response en json
    const data = await res.json();

    // Si no devuelve 200 OK
    if(!res.ok){
        return null;
    }

    return data.usuario
}