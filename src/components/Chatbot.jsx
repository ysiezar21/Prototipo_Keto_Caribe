import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, ShoppingBag, Phone } from 'lucide-react'
import { useApp } from '../store'
import ProductoImagen from './ProductoImagen.jsx'

export default function Chatbot() {
  const { ir, productos, agregarAlCarrito } = useApp()
  const [paso, setPaso] = useState(1) // 1: saludo, 2: opción, 3: consulta/pedido, 4: finalizado
  const [mensajes, setMensajes] = useState([
    { tipo: 'bot', texto: '¡Hola! 👋 Bienvenido a Keto Caribe Digital' },
    { tipo: 'bot', texto: '¿En qué puedo ayudarte hoy?' },
  ])
  const [cantidades, setCantidades] = useState({})
  const [entrega, setEntrega] = useState('domicilio')
  const messagesEnd = useRef(null)

  const productosDestacados = productos.slice(0, 3)

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [mensajes])

  // Opción 1: Consultar productos
  const consultarProductos = () => {
    setMensajes((prev) => [
      ...prev,
      { tipo: 'usuario', texto: 'Quiero consultar productos' },
      { tipo: 'bot', texto: '¡Excelente! Aquí están nuestros productos destacados:' },
    ])
    setPaso(3)
  }

  // Opción 2: Realizar pedido
  const iniciarPedido = () => {
    setMensajes((prev) => [
      ...prev,
      { tipo: 'usuario', texto: 'Quiero realizar un pedido' },
      { tipo: 'bot', texto: 'Perfecto 😊 Selecciona los productos que deseas:' },
    ])
    setPaso(3)
  }

  // Agregar producto al carrito
  const agregarProducto = (producto) => {
    agregarAlCarrito(producto, 1)
    setMensajes((prev) => [
      ...prev,
      { tipo: 'usuario', texto: `Agregar ${producto.nombre}` },
      { tipo: 'bot', texto: `✅ Agregado ${producto.nombre} al carrito` },
    ])
    setCantidades((prev) => ({
      ...prev,
      [producto.id]: (prev[producto.id] || 0) + 1,
    }))
  }

  // Finalizar pedido
  const finalizarPedido = () => {
    const totalProd = Object.values(cantidades).reduce((a, b) => a + b, 0)
    setMensajes((prev) => [
      ...prev,
      { tipo: 'usuario', texto: `Finalizar pedido (${totalProd} artículos)` },
      { tipo: 'bot', texto: '🔄 Un momento, estamos conectándote con nuestro asesor...' },
    ])
    setPaso(4)

    setTimeout(() => {
      setMensajes((prev) => [
        ...prev,
        { tipo: 'bot', texto: '¡Un asesor ya está disponible! 👨‍💼' },
        { tipo: 'bot', texto: 'Haz clic en el botón abajo para continuar por WhatsApp' },
      ])
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-keto/20">
              <MessageCircle className="w-6 h-6 text-keto" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-keto-dark">Chatbot Keto Caribe</h1>
              <p className="text-sm text-charcoal/70">Simulación WhatsApp</p>
            </div>
          </div>
          <button
            onClick={() => ir('home')}
            className="p-2 rounded-lg hover:bg-white/50 transition"
          >
            <X className="w-6 h-6 text-charcoal" />
          </button>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-md border border-keto/10 overflow-hidden flex flex-col h-[600px]">
          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream/30">
            {mensajes.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.tipo === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl font-body ${
                    msg.tipo === 'bot'
                      ? 'bg-keto/10 text-charcoal rounded-bl-none'
                      : 'bg-keto text-white rounded-br-none'
                  }`}
                >
                  <p className="text-sm">{msg.texto}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          {/* Opciones / Input */}
          <div className="p-4 border-t border-keto/10 bg-white space-y-3">
            {paso === 1 && (
              <div className="space-y-2">
                <button
                  onClick={consultarProductos}
                  className="w-full px-4 py-2 rounded-lg bg-keto text-white hover:bg-keto-dark transition font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver Productos
                </button>
                <button
                  onClick={iniciarPedido}
                  className="w-full px-4 py-2 rounded-lg bg-amber text-white hover:bg-amber/90 transition font-medium"
                >
                  Realizar Pedido
                </button>
              </div>
            )}

            {paso === 2 && (
              <div className="space-y-2">
                <button
                  onClick={consultarProductos}
                  className="w-full px-4 py-2 rounded-lg bg-keto text-white hover:bg-keto-dark transition"
                >
                  Consultar Productos
                </button>
                <button
                  onClick={iniciarPedido}
                  className="w-full px-4 py-2 rounded-lg bg-amber text-white hover:bg-amber/90 transition"
                >
                  Realizar Pedido
                </button>
              </div>
            )}

            {paso === 3 && (
              <div className="space-y-3">
                {/* Productos destacados */}
                <div className="grid gap-2">
                  {productosDestacados.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => agregarProducto(p)}
                      disabled={p.stock <= 0}
                      className="flex items-center gap-2 p-2 rounded-lg bg-keto/5 border border-keto/20 hover:bg-keto/10 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-cream text-xl">
                        <ProductoImagen producto={p} className="h-full w-full object-cover" emojiClassName="text-xl" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm text-charcoal">{p.nombre}</div>
                        <div className="text-xs text-charcoal/70">
                          ₡{p.precio.toLocaleString('es-CR')} • {p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Resumen de carrito */}
                {Object.keys(cantidades).length > 0 && (
                  <div className="p-3 rounded-lg bg-amber/10 border border-amber/30">
                    <div className="text-xs font-medium text-charcoal mb-2">
                      📦 Carrito: {Object.values(cantidades).reduce((a, b) => a + b, 0)} artículos
                    </div>
                    <div className="space-y-1 text-xs text-charcoal/70 mb-2">
                      {Object.entries(cantidades).map(([prodId, cant]) => {
                        const prod = productos.find((p) => p.id === parseInt(prodId))
                        return (
                          <div key={prodId}>
                            {cant}x {prod?.nombre}
                          </div>
                        )
                      })}
                    </div>
                    <button
                      onClick={finalizarPedido}
                      className="w-full px-3 py-1 rounded-lg bg-amber text-white text-xs font-medium hover:bg-amber/90 transition"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                )}

                {Object.keys(cantidades).length === 0 && (
                  <p className="text-xs text-charcoal/60 text-center py-2">
                    Toca un producto para agregarlo
                  </p>
                )}
              </div>
            )}

            {paso === 4 && (
              <div className="space-y-2">
                <a
                  href="https://wa.me/50671234567?text=Hola%20Keto%20Caribe%2C%20quisiera%20confirmar%20mi%20pedido"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continuar en WhatsApp
                </a>
                <button
                  onClick={() => ir('carrito')}
                  className="w-full px-4 py-2 rounded-lg bg-keto text-white hover:bg-keto-dark transition font-medium"
                >
                  Ir al Carrito
                </button>
                <button
                  onClick={() => {
                    setPaso(1)
                    setMensajes([
                      { tipo: 'bot', texto: '¡Hola! 👋 Bienvenido a Keto Caribe Digital' },
                      { tipo: 'bot', texto: '¿En qué puedo ayudarte hoy?' },
                    ])
                    setCantidades({})
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-keto/10 text-keto hover:bg-keto/15 transition font-medium"
                >
                  Nuevo Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-4 p-3 rounded-lg bg-keto/5 border border-keto/10 text-xs text-charcoal/70 text-center">
          Esta es una simulación del flujo de WhatsApp. Los datos se sincronizan con tu carrito.
        </div>
      </div>
    </div>
  )
}
