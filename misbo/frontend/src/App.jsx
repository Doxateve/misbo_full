import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/useAuth'

// La pagina de carga con el spinner centrado
import LoadingPage from "./pages/LoadingPage";

import Home from './pages/Home'
import Tienda from './pages/Tienda'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Register from './pages/Register'
import Login from './pages/Login'
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';

import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const { cargando } = useAuth()

  if (cargando) return <LoadingPage/>

  return (
    // min-h-screen + flex-1 en main empuja el footer al fondo aunque haya poco contenido
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-15">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/productos/:productoId" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App
