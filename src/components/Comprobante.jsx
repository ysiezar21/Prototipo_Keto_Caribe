import { ArrowLeft, Download, FileCode2, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react'
import { useApp } from '../store.jsx'
import { formatCRC, IVA, formatFechaCorta } from '../utils/factura.js'

function EstadoBadge({ estado }) {
  const map = {
    'Aceptado': { Icon: CheckCircle2, cls: 'bg-keto/15 text-keto-dark', t: 'Aceptado por Hacienda' },
    'En proceso': { Icon: Clock, cls: 'bg-amber/20 text-amber-dark animate-pulse', t: 'En proceso (TRIBU-CR)' },
    'Rechazado': { Icon: XCircle, cls: 'bg-red-100 text-red-700', t: 'Rechazado' },
    'Anulado': { Icon: XCircle, cls: 'bg-charcoal/10 text-charcoal/60', t: 'Anulado (nota de crédito)' },
  }
  const { Icon, cls, t } = map[estado] || map['En proceso']
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${cls}`}>
      <Icon size={16} /> {t}
    </span>
  )
}

// Genera y descarga un XML de demostración del comprobante (factura electrónica v4.4)
function descargarXML(p) {
  const lineas = p.items
    .map(
      (i, idx) => `    <LineaDetalle>
      <NumeroLinea>${idx + 1}</NumeroLinea>
      <CodigoCABYS>${i.cabys}</CodigoCABYS>
      <Cantidad>${i.cantidad}</Cantidad>
      <Detalle>${i.nombre}</Detalle>
      <PrecioUnitario>${Math.round(i.precio / (1 + IVA))}</PrecioUnitario>
      <MontoTotal>${Math.round((i.precio / (1 + IVA)) * i.cantidad)}</MontoTotal>
      <Impuesto><Codigo>01</Codigo><Tarifa>13.00</Tarifa></Impuesto>
    </LineaDetalle>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<FacturaElectronica xmlns="https://cdn.comprobanteselectronicos.go.cr/xml-schemas/v4.4/facturaElectronica">
  <Clave>${p.clave}</Clave>
  <NumeroConsecutivo>${p.consecutivo}</NumeroConsecutivo>
  <FechaEmision>${p.fechaEmision}</FechaEmision>
  <Emisor><Nombre>Keto Caribe</Nombre><Identificacion><Tipo>02</Tipo><Numero>3101234560</Numero></Identificacion></Emisor>
  <Receptor><Nombre>${p.cliente.nombre}</Nombre><Identificacion><Numero>${p.cliente.cedula}</Numero></Identificacion></Receptor>
  <DetalleServicio>
${lineas}
  </DetalleServicio>
  <ResumenFactura>
    <TotalVentaNeta>${p.subtotal}</TotalVentaNeta>
    <TotalImpuesto>${p.iva}</TotalImpuesto>
    <TotalComprobante>${p.total}</TotalComprobante>
  </ResumenFactura>
</FacturaElectronica>`

  const blob = new Blob([xml], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comprobante-${p.clave}.xml`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Comprobante() {
  const { ultimoPedido, pedidos, ir } = useApp()
  // Toma la version mas reciente del pedido (estado Hacienda puede haber cambiado)
  const p = pedidos.find((x) => x.id === ultimoPedido?.id) || ultimoPedido

  if (!p)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p>No hay comprobante para mostrar.</p>
        <button onClick={() => ir('catalogo')} className="mt-4 text-keto-dark underline">Ir a la tienda</button>
      </div>
    )

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button onClick={() => ir('confirmacion')} className="mb-4 flex items-center gap-1 text-sm font-medium text-keto-dark hover:text-keto">
        <ArrowLeft size={18} /> Volver
      </button>

      <div className="overflow-hidden rounded-2xl border border-keto/15 bg-white shadow-md">
        {/* Encabezado */}
        <div className="bg-keto-dark px-6 py-5 text-cream">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber font-display font-bold text-keto-dark">K</div>
                <div>
                  <p className="font-display text-lg font-bold">Keto Caribe</p>
                  <p className="text-xs text-cream/70">Céd. jurídica 3-101-234560 · Limón, CR</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-semibold">FACTURA ELECTRÓNICA</p>
              <p className="text-xs text-cream/70">Versión 4.4 · Hacienda</p>
            </div>
          </div>
        </div>

        {/* Estado + clave */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-keto/10 bg-cream/60 px-6 py-4">
          <EstadoBadge estado={p.estadoHacienda} />
          <span className="inline-flex items-center gap-1 text-xs text-charcoal/60">
            <ShieldCheck size={14} className="text-keto" /> Validado vía TRIBU-CR
          </span>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-charcoal/50">Clave numérica (50 dígitos)</p>
              <p className="mt-1 break-all rounded-lg bg-cream px-3 py-2 font-mono text-xs text-charcoal">{p.clave}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">Consecutivo</p>
                <p className="font-mono text-xs">{p.consecutivo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-charcoal/50">Fecha emisión</p>
                <p>{formatFechaCorta(new Date(p.fechaEmision))}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wide text-charcoal/50">Cliente</p>
                <p>{p.cliente.nombre} · Ced. {p.cliente.cedula}</p>
              </div>
            </div>
          </div>

          {/* Detalle de lineas con CABYS e IVA */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-keto/15 text-left text-xs uppercase tracking-wide text-charcoal/50">
                  <th className="py-2 pr-2">Detalle</th>
                  <th className="py-2 pr-2">CABYS</th>
                  <th className="py-2 pr-2 text-center">Cant.</th>
                  <th className="py-2 pr-2 text-right">P. unit.</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {p.items.map((i) => {
                  const unitSinIva = Math.round(i.precio / (1 + IVA))
                  return (
                    <tr key={i.id} className="border-b border-keto/5">
                      <td className="py-2 pr-2 font-medium text-charcoal">{i.nombre}</td>
                      <td className="py-2 pr-2 font-mono text-xs text-charcoal/60">{i.cabys}</td>
                      <td className="py-2 pr-2 text-center">{i.cantidad}</td>
                      <td className="py-2 pr-2 text-right">{formatCRC(unitSinIva)}</td>
                      <td className="py-2 text-right font-semibold">{formatCRC(unitSinIva * i.cantidad)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-charcoal/70"><span>Venta neta</span><span>{formatCRC(p.subtotal)}</span></div>
            <div className="flex justify-between text-charcoal/70"><span>IVA (13%)</span><span>{formatCRC(p.iva)}</span></div>
            <div className="flex justify-between border-t border-keto/15 pt-2 font-display text-lg font-bold text-keto-dark">
              <span>Total</span><span>{formatCRC(p.total)}</span>
            </div>
          </div>

          {p.notaCredito && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <p className="font-semibold">Nota de crédito emitida</p>
              <p className="break-all font-mono text-xs">Clave NC: {p.notaCredito.clave}</p>
            </div>
          )}
        </div>

        {/* Descargas */}
        <div className="flex flex-wrap gap-3 border-t border-keto/10 bg-cream/60 px-6 py-4">
          <button onClick={() => descargarXML(p)} className="flex items-center gap-2 rounded-xl bg-keto px-5 py-2.5 text-sm font-semibold text-white hover:bg-keto-dark">
            <FileCode2 size={16} /> Descargar XML
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-keto/30 px-5 py-2.5 text-sm font-semibold text-keto-dark hover:bg-keto/10">
            <Download size={16} /> Descargar PDF
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-charcoal/50">
        Integración nueva (Evento C) · Emisor Alanube · Comprobante respaldado 5 años conforme a la normativa fiscal.
      </p>
    </div>
  )
}
