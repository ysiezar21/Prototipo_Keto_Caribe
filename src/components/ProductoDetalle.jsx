import { useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from 'lucide-react'
import { useApp } from '../store.jsx'
import { formatCRC } from '../utils/factura.js'
import ProductoImagen from './ProductoImagen.jsx'

export default function ProductoDetalle() {
  const { productoActivo, productos, ir, agregarAlCarrito } = useApp()
  const [cant, setCant] = useState(1)
  const [agregado, setAgregado] = useState(false)

  // Toma el stock vivo del estado (puede haber bajado por compras)
  const p = productos.find((x) => x.id === productoActivo?.id) || productoActivo
  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p>Producto no encontrado.</p>
        <button onClick={() => ir('catalogo')} className="mt-4 text-keto-dark underline">Volver al catálogo</button>
      </div>
    )
  }

  const agotado = p.stock <= 0
  const bajo = !agotado && p.stock <= p.umbral

  const handleAdd = () => {
    if (agregarAlCarrito(p, cant)) {
      setAgregado(true)
      setTimeout(() => setAgregado(false), 1800)
    }
  }

  const N = ({ label, value, unit }) => (
    <div className="rounded-xl bg-cream p-3 text-center">
      <p className="font-display text-lg font-bold text-keto-dark">{value}{unit}</p>
      <p className="text-[11px] uppercase tracking-wide text-charcoal/60">{label}</p>
    </div>
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button onClick={() => ir('catalogo')} className="mb-4 flex items-center gap-1 text-sm font-medium text-keto-dark hover:text-keto">
        <ArrowLeft size={18} /> Volver al catálogo
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-white text-[10rem] shadow-sm">
          <ProductoImagen producto={p} className="h-full w-full object-cover" emojiClassName="text-[10rem]" />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold ${
              agotado ? 'bg-red-100 text-red-700' : bajo ? 'bg-amber/20 text-amber-dark' : 'bg-keto/15 text-keto-dark'
            }`}
          >
            {agotado ? 'Agotado' : bajo ? `Quedan ${p.stock}` : 'Disponible'}
          </span>
        </div>

        <div>
          <span className="text-sm font-medium uppercase tracking-wide text-keto">{p.categoria}</span>
          <h1 className="mt-1 font-display text-3xl font-bold text-keto-dark">{p.nombre}</h1>
          <p className="mt-3 text-charcoal/70">{p.descripcion}</p>
          <p className="mt-4 font-display text-3xl font-bold text-charcoal">{formatCRC(p.precio)}</p>
          <p className="text-xs text-charcoal/50">IVA incluido · CABYS {p.cabys}</p>

          {/* Selector de cantidad */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-keto/20 bg-white">
              <button onClick={() => setCant((c) => Math.max(1, c - 1))} className="p-3 text-keto-dark disabled:opacity-30" disabled={agotado}>
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-display font-semibold">{cant}</span>
              <button onClick={() => setCant((c) => Math.min(p.stock, c + 1))} className="p-3 text-keto-dark disabled:opacity-30" disabled={agotado || cant >= p.stock}>
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={agotado}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-dark disabled:cursor-not-allowed disabled:bg-charcoal/20"
            >
              {agregado ? <><Check size={18} /> Agregado</> : <><ShoppingCart size={18} /> Agregar al carrito</>}
            </button>
          </div>

          {/* Info nutricional */}
          <h3 className="mt-8 font-display font-semibold text-keto-dark">Información nutricional</h3>
          <p className="text-xs text-charcoal/50">Valores por porción</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            <N label="Calorías" value={p.nutricion.calorias} unit="" />
            <N label="Carbos" value={p.nutricion.carbos} unit="g" />
            <N label="Proteína" value={p.nutricion.proteina} unit="g" />
            <N label="Grasa" value={p.nutricion.grasa} unit="g" />
          </div>

          {/* Ingredientes */}
          <h3 className="mt-6 font-display font-semibold text-keto-dark">Ingredientes</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.ingredientes.map((i) => (
              <span key={i} className="rounded-full bg-white px-3 py-1 text-sm text-charcoal/70 shadow-sm">{i}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
