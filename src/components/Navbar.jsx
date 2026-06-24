import { useState } from 'react'
import { ShoppingCart, Menu, X, LayoutDashboard, Store, Home as HomeIcon, MessageCircle } from 'lucide-react'
import { useApp } from '../store.jsx'

export default function Navbar() {
  const { ir, pantalla, totalItems } = useApp()
  const [abierto, setAbierto] = useState(false)

  const link = (id, label, Icon) => {
    const activo = pantalla === id
    return (
      <button
        onClick={() => {
          ir(id)
          setAbierto(false)
        }}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          activo ? 'bg-keto/15 text-keto-dark' : 'text-charcoal/80 hover:bg-keto/10 hover:text-keto-dark'
        }`}
      >
        <Icon size={18} /> {label}
      </button>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-keto/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => ir('home')} className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-keto-dark font-display text-lg font-bold text-amber">
            K
          </div>
          <div className="text-left leading-tight">
            <p className="font-display text-lg font-bold text-keto-dark">Keto Caribe</p>
            <p className="text-[11px] text-charcoal/60">Repostería saludable · Limón</p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {link('home', 'Inicio', HomeIcon)}
          {link('catalogo', 'Tienda', Store)}
          {link('panel', 'Panel', LayoutDashboard)}
          {link('chatbot', 'Chat', MessageCircle)}
          <button
            onClick={() => ir('carrito')}
            className="relative ml-1 flex items-center gap-2 rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-dark"
          >
            <ShoppingCart size={18} /> Carrito
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-keto-dark text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => ir('carrito')} className="relative rounded-lg bg-amber p-2 text-white">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-keto-dark text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <button onClick={() => setAbierto((v) => !v)} className="rounded-lg p-2 text-keto-dark">
            {abierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav className="flex flex-col gap-1 border-t border-keto/10 bg-cream px-4 py-3 md:hidden">
          {link('home', 'Inicio', HomeIcon)}
          {link('catalogo', 'Tienda', Store)}
          {link('panel', 'Panel del propietario', LayoutDashboard)}
          {link('chatbot', 'Chat de WhatsApp', MessageCircle)}
        </nav>
      )}
    </header>
  )
}
