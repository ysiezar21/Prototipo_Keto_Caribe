import { useMemo, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { useApp } from '../store.jsx'
import { formatCRC } from '../utils/factura.js'
import ProductoImagen from './ProductoImagen.jsx'

export default function Catalogo() {
  const { productos, verProducto, agregarAlCarrito } = useApp()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('Todas')

  const categorias = useMemo(
    () => ['Todas', ...Array.from(new Set(productos.map((p) => p.categoria)))],
    [productos],
  )

  const filtrados = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(query.toLowerCase())
    const coincideCat = cat === 'Todas' || p.categoria === cat
    return coincideTexto && coincideCat
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-keto-dark">Catálogo de productos</h1>
      <p className="text-charcoal/60">Repostería y panadería keto · {productos.length} productos</p>

      {/* Buscador + filtros */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto…"
            className="w-full rounded-xl border border-keto/20 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-keto"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                cat === c ? 'bg-keto-dark text-white' : 'bg-white text-charcoal/70 hover:bg-keto/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="mt-12 text-center text-charcoal/60">No se encontraron productos.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((p) => {
            const agotado = p.stock <= 0
            const bajo = !agotado && p.stock <= p.umbral
            return (
              <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-keto/10 bg-white shadow-sm transition hover:shadow-md">
                <button onClick={() => verProducto(p)} className="relative grid aspect-square place-items-center overflow-hidden bg-cream text-6xl">
                  <ProductoImagen producto={p} className="h-full w-full object-cover transition group-hover:scale-105" emojiClassName="text-6xl" />
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      agotado ? 'bg-red-100 text-red-700' : bajo ? 'bg-amber/20 text-amber-dark' : 'bg-keto/15 text-keto-dark'
                    }`}
                  >
                    {agotado ? 'Agotado' : bajo ? 'Últimas unidades' : 'Disponible'}
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-keto">{p.categoria}</span>
                  <button onClick={() => verProducto(p)} className="text-left">
                    <h3 className="font-display text-sm font-semibold text-keto-dark hover:underline">{p.nombre}</h3>
                  </button>
                  <p className="mt-2 font-display text-lg font-bold text-charcoal">{formatCRC(p.precio)}</p>
                  <button
                    disabled={agotado}
                    onClick={() => agregarAlCarrito(p)}
                    className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-keto px-3 py-2 text-sm font-semibold text-white transition hover:bg-keto-dark disabled:cursor-not-allowed disabled:bg-charcoal/20"
                  >
                    <Plus size={16} /> {agotado ? 'No disponible' : 'Agregar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
