import { useState } from 'react'
import { AlertCircle, TrendingDown, CheckCircle2, Clock, X } from 'lucide-react'
import { useApp } from '../store'

export default function PanelPropietario() {
  const { pedidos, productos, cambiarEstadoPedido, emitirNotaCredito, ir } = useApp()
  const [filtroEstado, setFiltroEstado] = useState('todos')

  // Filtrar pedidos por estado
  const pedidosFiltrados = filtroEstado === 'todos'
    ? pedidos
    : pedidos.filter((p) => p.estado === filtroEstado)

  // Alertas de inventario - productos con stock bajo
  const productosStockBajo = productos.filter((p) => p.stock > 0 && p.stock <= p.umbral)

  // Calcular estadísticas
  const totalPedidos = pedidos.length
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length
  const aceptados = pedidos.filter((p) => p.estadoHacienda === 'Aceptado').length

  const estados = ['todos', 'pendiente', 'en preparacion', 'listo', 'entregado']

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-keto-dark mb-2">Panel del Propietario</h1>
              <p className="text-charcoal/70">Gestión de pedidos, comprobantes e inventario</p>
            </div>
            <button
              onClick={() => ir('home')}
              className="px-4 py-2 rounded-lg bg-keto/10 text-keto hover:bg-keto/15 transition"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-keto/10">
            <div className="text-sm text-charcoal/70 mb-1">Total Pedidos</div>
            <div className="text-3xl font-bold text-keto">{totalPedidos}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-keto/10">
            <div className="text-sm text-charcoal/70 mb-1">Pendientes</div>
            <div className="text-3xl font-bold text-amber">{pendientes}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-keto/10">
            <div className="text-sm text-charcoal/70 mb-1">Comprobantes Aceptados</div>
            <div className="text-3xl font-bold text-keto-dark">{aceptados}</div>
          </div>
        </div>

        {/* Alertas de Inventario */}
        {productosStockBajo.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-amber/10 border border-amber/30">
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-charcoal mb-2">Alerta de Stock Bajo</h3>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  {productosStockBajo.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div>
                        <div className="font-medium text-charcoal">{p.nombre}</div>
                        <div className="text-charcoal/60">Stock: {p.stock} / Umbral: {p.umbral}</div>
                      </div>
                      <TrendingDown className="w-4 h-4 text-amber" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {estados.map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  filtroEstado === estado
                    ? 'bg-keto text-white'
                    : 'bg-white border border-keto/20 text-charcoal hover:border-keto/40'
                }`}
              >
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Pedidos */}
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-keto/10">
            <Clock className="w-12 h-12 text-charcoal/30 mx-auto mb-3" />
            <p className="text-charcoal/60">No hay pedidos con este estado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidosFiltrados.map((pedido) => (
              <div key={pedido.id} className="p-4 rounded-2xl bg-white shadow-sm border border-keto/10">
                <div className="grid lg:grid-cols-[1fr_200px_150px_200px_100px] gap-4">
                  {/* Info Pedido */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <div className="font-bold text-charcoal">Pedido #{pedido.id}</div>
                      <div className="text-xs text-charcoal/60">{pedido.consecutivo}</div>
                    </div>
                    <div className="text-sm text-charcoal/70 mb-2">
                      <strong>{pedido.cliente.nombre}</strong> • {pedido.cliente.cedula}
                    </div>
                    <div className="text-xs text-charcoal/60">
                      {new Date(pedido.fechaEmision).toLocaleDateString('es-CR')}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div className="text-xs text-charcoal/60 mb-1">Total</div>
                    <div className="text-lg font-bold text-keto">₡{pedido.total.toLocaleString('es-CR')}</div>
                  </div>

                  {/* Estado Pedido */}
                  <div>
                    <label className="text-xs text-charcoal/60 block mb-1">Estado</label>
                    <select
                      value={pedido.estado}
                      onChange={(e) => cambiarEstadoPedido(pedido.id, e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-keto/20 text-sm font-medium focus:border-keto"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en preparacion">En preparación</option>
                      <option value="listo">Listo</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </div>

                  {/* Estado Hacienda */}
                  <div>
                    <div className="text-xs text-charcoal/60 mb-1">Estado Hacienda</div>
                    <div className="flex items-center gap-2">
                      {pedido.estadoHacienda === 'Aceptado' ? (
                        <CheckCircle2 className="w-5 h-5 text-keto flex-shrink-0" />
                      ) : pedido.estadoHacienda === 'En proceso' ? (
                        <Clock className="w-5 h-5 text-amber flex-shrink-0" />
                      ) : pedido.estadoHacienda === 'Rechazado' ? (
                        <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-charcoal/50 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">{pedido.estadoHacienda}</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => emitirNotaCredito(pedido.id)}
                      disabled={pedido.estadoHacienda === 'Anulado'}
                      className="px-3 py-1 rounded-lg bg-red-500/10 text-red-600 text-xs font-medium hover:bg-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pedido.notaCredito ? 'Nota Emitida' : 'Nota Crédito'}
                    </button>
                    <button
                      onClick={() => ir('comprobante')}
                      className="px-3 py-1 rounded-lg bg-keto/10 text-keto text-xs font-medium hover:bg-keto/15 transition"
                    >
                      Ver XML
                    </button>
                  </div>
                </div>

                {/* Detalle de Items */}
                <div className="mt-3 pt-3 border-t border-keto/10">
                  <div className="text-xs text-charcoal/70">
                    {pedido.items.length} artículo{pedido.items.length !== 1 ? 's' : ''}:{' '}
                    {pedido.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}
                  </div>
                </div>

                {/* Nota Crédito */}
                {pedido.notaCredito && (
                  <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                    <div className="text-xs font-medium text-red-700">
                      Nota de Crédito: {pedido.notaCredito.clave}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
