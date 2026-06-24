import { CheckCircle2, FileText, Home, CalendarClock, MessageCircle } from 'lucide-react'
import { useApp } from '../store.jsx'
import { formatCRC, formatFecha } from '../utils/factura.js'

export default function Confirmacion() {
  const { ultimoPedido, ir } = useApp()

  if (!ultimoPedido)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p>No hay un pedido reciente.</p>
        <button onClick={() => ir('catalogo')} className="mt-4 text-keto-dark underline">Ir a la tienda</button>
      </div>
    )

  const p = ultimoPedido

  return (
    <div className="mx-auto max-w-xl px-4 py-12 text-center">
      <CheckCircle2 size={72} className="mx-auto text-keto" />
      <h1 className="mt-4 font-display text-3xl font-bold text-keto-dark">¡Pedido confirmado!</h1>
      <p className="mt-1 text-charcoal/70">Gracias por tu compra. Te enviamos la confirmación por WhatsApp.</p>

      <div className="mt-8 rounded-2xl border border-keto/10 bg-white p-6 text-left shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-charcoal/60">Número de pedido</span>
          <span className="font-display text-xl font-bold text-keto-dark">#{p.id}</span>
        </div>
        <div className="my-3 border-t border-dashed border-keto/20" />
        <div className="space-y-2 text-sm">
          {p.items.map((i) => (
            <div key={i.id} className="flex justify-between text-charcoal/70">
              <span>{i.cantidad}× {i.nombre}</span>
              <span>{formatCRC(i.precio * i.cantidad)}</span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-dashed border-keto/20" />
        <div className="flex justify-between font-display text-lg font-bold text-keto-dark">
          <span>Total pagado</span><span>{formatCRC(p.total)}</span>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-keto/5 p-3 text-sm">
          <CalendarClock size={18} className="mt-0.5 shrink-0 text-keto-dark" />
          <span className="text-charcoal/70">
            Listo a partir del <strong>{formatFecha(new Date(p.fechaEntrega))}</strong> · {p.metodoEntrega.tipo}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button onClick={() => ir('comprobante')} className="flex items-center justify-center gap-2 rounded-xl bg-amber px-6 py-3 font-semibold text-white shadow-md hover:bg-amber-dark">
          <FileText size={18} /> Ver comprobante electrónico
        </button>
        <button onClick={() => ir('chatbot')} className="flex items-center justify-center gap-2 rounded-xl border-2 border-keto px-6 py-3 font-semibold text-keto-dark hover:bg-keto/10">
          <MessageCircle size={18} /> Seguir por WhatsApp
        </button>
      </div>
      <button onClick={() => ir('home')} className="mt-4 flex w-full items-center justify-center gap-1 text-sm text-charcoal/60 hover:text-keto-dark">
        <Home size={16} /> Volver al inicio
      </button>
    </div>
  )
}
