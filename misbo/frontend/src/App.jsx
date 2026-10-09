import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/useAuth'

// La pagina de carga con el spinner centrado
import LoadingPage from "./pages/LoadingPage";

import Home from './pages/Home'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Register from './pages/Register'
import Login from './pages/Login'
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';

import Navbar from './components/Navbar'

function App() {
  const { cargando } = useAuth()

  if (cargando) return <LoadingPage/>

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-15">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos/:productoId" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}

export default App