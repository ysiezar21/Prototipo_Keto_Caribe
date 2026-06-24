import { useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag, CalendarClock, ArrowRight, ArrowLeft } from 'lucide-react'
import { useApp } from '../store.jsx'
import { formatCRC, calcularFechaMinima, formatFecha } from '../utils/factura.js'
import ProductoImagen from './ProductoImagen.jsx'

export default function Carrito() {
  const {
    carrito, cambiarCantidad, quitarDelCarrito, totales, ir,
    horasCola, horasPedidoActual, confirmarPedido,
  } = useApp()

  const [form, setForm] = useState({
    nombre: '', cedula: '', telefono: '', correo: '',
    metodo: 'Entrega a domicilio', direccion: '', pago: 'SINPE Móvil',
  })
  const [errores, setErrores] = useState({})

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const { dias, fecha } = calcularFechaMinima(horasCola, horasPedidoActual)

  if (carrito.length === 0)
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-keto/40" />
        <h2 className="mt-4 font-display text-2xl font-bold text-keto-dark">Tu carrito está vacío</h2>
        <p className="mt-1 text-charcoal/60">Agregá productos desde la tienda para continuar.</p>
        <button onClick={() => ir('catalogo')} className="mt-6 rounded-xl bg-amber px-6 py-3 font-semibold text-white hover:bg-amber-dark">
          Ir a la tienda
        </button>
      </div>
    )

  const validar = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido para la factura'
    if (!/^[0-9]{9,12}$/.test(form.cedula.trim())) e.cedula = 'Cédula/identificación válida (9-12 dígitos)'
    if (!/^[0-9]{8}$/.test(form.telefono.trim())) e.telefono = 'Teléfono de 8 dígitos'
    if (form.correo && !/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = 'Correo no válido'
    if (form.metodo === 'Entrega a domicilio' && !form.direccion.trim()) e.direccion = 'Indicá la dirección'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handlePagar = () => {
    if (!validar()) return
    confirmarPedido(
      { nombre: form.nombre, cedula: form.cedula, telefono: form.telefono, correo: form.correo },
      { tipo: form.metodo, direccion: form.direccion, pago: form.pago },
    )
  }

  const Campo = ({ label, k, type = 'text', placeholder, full }) => (
    <label className={full ? 'sm:col-span-2' : ''}>
      <span className="text-sm font-medium text-charcoal/80">{label}</span>
      <input
        type={type}
        value={form[k]}
        onChange={set(k)}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-keto ${
          errores[k] ? 'border-red-400' : 'border-keto/20'
        }`}
      />
      {errores[k] && <span className="text-xs text-red-500">{errores[k]}</span>}
    </label>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <button onClick={() => ir('catalogo')} className="mb-4 flex items-center gap-1 text-sm font-medium text-keto-dark hover:text-keto">
        <ArrowLeft size={18} /> Seguir comprando
      </button>
      <h1 className="font-display text-3xl font-bold text-keto-dark">Carrito y checkout</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Items + datos del cliente */}
        <div className="space-y-6">
          <div className="space-y-3">
            {carrito.map((i) => (
              <div key={i.id} className="flex items-center gap-4 rounded-2xl border border-keto/10 bg-white p-3 shadow-sm">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-cream text-3xl">
                  <ProductoImagen producto={i} className="h-full w-full object-cover" emojiClassName="text-3xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display font-semibold text-keto-dark">{i.nombre}</h3>
                  <p className="text-sm text-charcoal/60">{formatCRC(i.precio)} c/u</p>
                </div>
                <div className="flex items-center rounded-lg border border-keto/20">
                  <button onClick={() => cambiarCantidad(i.id, -1)} className="p-2 text-keto-dark"><Minus size={14} /></button>
                  <span className="w-8 text-center text-sm font-semibold">{i.cantidad}</span>
                  <button onClick={() => cambiarCantidad(i.id, +1)} className="p-2 text-keto-dark"><Plus size={14} /></button>
                </div>
                <p className="w-24 text-right font-display font-bold text-charcoal">{formatCRC(i.precio * i.cantidad)}</p>
                <button onClick={() => quitarDelCarrito(i.id)} className="text-charcoal/40 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>

          {/* Cola de produccion / fecha minima */}
          <div className="flex items-start gap-3 rounded-2xl border border-keto/20 bg-keto/5 p-4">
            <CalendarClock className="mt-0.5 shrink-0 text-keto-dark" size={22} />
            <div className="text-sm">
              <p className="font-display font-semibold text-keto-dark">
                Tu pedido puede estar listo a partir del {formatFecha(fecha)}
              </p>
              <p className="text-charcoal/60">
                Estimado en {dias} día(s), considerando la cola de producción actual
                ({horasCola}h en cola + {horasPedidoActual}h de tu pedido, a 4h/día).
              </p>
            </div>
          </div>

          {/* Datos del cliente para la factura electronica */}
          <div className="rounded-2xl border border-keto/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-keto-dark">Datos para la factura electrónica</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Campo label="Nombre completo / razón social" k="nombre" placeholder="Ej. María Rodríguez" full />
              <Campo label="Cédula / identificación" k="cedula" placeholder="Solo dígitos" />
              <Campo label="Teléfono (WhatsApp)" k="telefono" placeholder="88880000" />
              <Campo label="Correo (envío del comprobante)" k="correo" type="email" placeholder="correo@ejemplo.com" full />
            </div>

            <h3 className="mt-5 font-display font-semibold text-keto-dark">Método de entrega</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Entrega a domicilio', 'Retiro acordado'].map((m) => (
                <button
                  key={m}
                  onClick={() => setForm((f) => ({ ...f, metodo: m }))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    form.metodo === m ? 'bg-keto-dark text-white' : 'bg-cream text-charcoal/70'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {form.metodo === 'Entrega a domicilio' && <div className="mt-3"><Campo label="Dirección de entrega" k="direccion" placeholder="Provincia, cantón, señas" full /></div>}

            <h3 className="mt-5 font-display font-semibold text-keto-dark">Método de pago</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {['SINPE Móvil', 'Tarjeta', 'Pago contra entrega'].map((m) => (
                <button
                  key={m}
                  onClick={() => setForm((f) => ({ ...f, pago: m }))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    form.pago === m ? 'bg-keto text-white' : 'bg-cream text-charcoal/70'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl border border-keto/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold text-keto-dark">Resumen del pedido</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-charcoal/70"><span>Subtotal (sin IVA)</span><span>{formatCRC(totales.subtotal)}</span></div>
            <div className="flex justify-between text-charcoal/70"><span>IVA (13%)</span><span>{formatCRC(totales.iva)}</span></div>
            <div className="my-2 border-t border-dashed border-keto/20" />
            <div className="flex justify-between font-display text-xl font-bold text-keto-dark"><span>Total</span><span>{formatCRC(totales.total)}</span></div>
          </div>
          <button
            onClick={handlePagar}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber px-6 py-3 font-semibold text-white shadow-md transition hover:bg-amber-dark"
          >
            Pagar y emitir factura <ArrowRight size={18} />
          </button>
          <p className="mt-3 text-center text-xs text-charcoal/50">
            Al confirmar se emite un comprobante electrónico v4.4 ante Hacienda (TRIBU-CR).
          </p>
        </aside>
      </div>
    </div>
  )
}
