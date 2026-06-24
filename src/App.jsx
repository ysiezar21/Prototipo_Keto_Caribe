import { AppProvider, useApp } from './store.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Catalogo from './components/Catalogo.jsx'
import ProductoDetalle from './components/ProductoDetalle.jsx'
import Carrito from './components/Carrito.jsx'
import Confirmacion from './components/Confirmacion.jsx'
import Comprobante from './components/Comprobante.jsx'
import PanelPropietario from './components/PanelPropietario.jsx'
import Chatbot from './components/Chatbot.jsx'
import Footer from './components/Footer.jsx'

function Vista() {
  const { pantalla, cargando, error } = useApp()

  if (cargando)
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-keto/30 border-t-keto" />
          <p className="font-display text-keto-dark">Cargando base de datos…</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="grid min-h-screen place-items-center bg-cream p-6 text-center">
        <p className="text-red-600">Error al cargar productos.txt: {error}</p>
      </div>
    )

  const pantallas = {
    home: <Home />,
    catalogo: <Catalogo />,
    detalle: <ProductoDetalle />,
    carrito: <Carrito />,
    confirmacion: <Confirmacion />,
    comprobante: <Comprobante />,
    panel: <PanelPropietario />,
    chatbot: <Chatbot />,
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Navbar />
      <main className="flex-1 animate-fade-up">{pantallas[pantalla] || <Home />}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Vista />
    </AppProvider>
  )
}
