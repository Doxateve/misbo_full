import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

import { usuarioActual } from '../services/auth.services'

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)

    // Cargando empieza en true mientras el useEffect le hace la peticion a la API
    const [cargando, setCargando] = useState(true)

    // Hace lo siguiente al cargar el provider
    useEffect(() => {
        // Fetch a /api/auth/usuario/yo (sin especificar host pq tiene q ser en el mismo q el backend lol)
        usuarioActual() // Incluir credenciales para que incluya cookies
            .then(setUsuario)
            .catch(() => setUsuario(null)) // Si da error o 400 quiere decir que no está autenticado
            .finally(() => setCargando(false)) // Pasa cargando a false cuando acaba la peticion
    }, []);
    
    return (
        // Le pasa al hijo usuario, cargando y setUsuario
        <AuthContext.Provider value={{ usuario, setUsuario, cargando }}>
            {children}
        </AuthContext.Provider>
  );
};