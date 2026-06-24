import { ArrowRight, MessageCircle, ShieldCheck, Clock, Leaf, Star } from 'lucide-react'
import { useApp } from '../store.jsx'
import { formatCRC } from '../utils/factura.js'
import ProductoImagen from './ProductoImagen.jsx'

export default function Home() {
  const { ir, productos, verProducto, agregarAlCarrito } = useApp()
  const destacados = productos.filter((p) => p.stock > 0).slice(0, 4)

  return (
    <div>
      {/* Hero / banner */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-keto/15 px-3 py-1 text-sm font-medium text-keto-dark">
              <Leaf size={16} /> 100% keto · Sin azúcar añadida
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-keto-dark md:text-5xl">
              Dulces y panadería keto, <span className="text-amber">hechos en Limón</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-charcoal/70">
              Ordená en línea, recibí tu pedido coordinado y obtené tu factura electrónica al
              instante. Repostería artesanal baja en carbohidratos, hecha bajo pedido.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => ir('catalogo')}
                className="flex items-center gap-2 rounded-xl bg-amber px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-dark"
              >
                Ir a la tienda <ArrowRight size={18} />
              </button>
              <button
                onClick={() => ir('chatbot')}
                className="flex items-center gap-2 rounded-xl border-2 border-keto px-6 py-3 font-semibold text-keto-dark transition hover:bg-keto/10"
              >
                <MessageCircle size={18} /> Pedir por WhatsApp
              </button>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-4">
            {destacados.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className={`grid aspect-square place-items-center overflow-hidden rounded-3xl bg-white text-6xl shadow-sm ${
                  i % 2 ? 'translate-y-6' : ''
                }`}
              >
                <ProductoImagen producto={p} className="h-full w-full object-cover" emojiClassName="text-6xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3">
        {[
          { Icon: ShieldCheck, t: 'Factura electrónica', d: 'Comprobantes v4.4 válidos ante Hacienda en cada compra.' },
          { Icon: Clock, t: 'Hecho bajo pedido', d: 'Te mostramos la fecha más pronta de entrega según la cola.' },
          { Icon: Leaf, t: 'Ingredientes keto', d: 'Endulzado con eritritol y monk fruit, alto en fibra.' },
        ].map(({ Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-keto/10 bg-white p-5 shadow-sm">
            <Icon className="text-keto" size={26} />
            <h3 className="mt-2 font-display font-semibold text-keto-dark">{t}</h3>
            <p className="mt-1 text-sm text-charcoal/70">{d}</p>
          </div>
        ))}
      </section>

      {/* Productos destacados */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-keto-dark">Productos destacados</h2>
            <p className="text-sm text-charcoal/60">Lo más pedido de nuestra repostería</p>
          </div>
          <button onClick={() => ir('catalogo')} className="flex items-center gap-1 text-sm font-semibold text-keto-dark hover:text-keto">
            Ver todo <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {destacados.map((p) => (
            <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-keto/10 bg-white shadow-sm transition hover:shadow-md">
              <button onClick={() => verProducto(p)} className="grid aspect-square place-items-center overflow-hidden bg-cream text-6xl">
                <ProductoImagen producto={p} className="h-full w-full object-cover transition group-hover:scale-105" emojiClassName="text-6xl" />
              </button>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[11px] font-medium uppercase tracking-wide text-keto">{p.categoria}</span>
                <h3 className="font-display text-sm font-semibold text-keto-dark">{p.nombre}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-amber">
                  <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" />
                </div>
                <p className="mt-2 font-display text-lg font-bold text-charcoal">{formatCRC(p.precio)}</p>
                <button
                  onClick={() => agregarAlCarrito(p)}
                  className="mt-3 rounded-lg bg-keto px-3 py-2 text-sm font-semibold text-white transition hover:bg-keto-dark"
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
