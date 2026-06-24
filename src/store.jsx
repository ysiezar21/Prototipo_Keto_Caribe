import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { cargarProductos } from './data/loadData.js'
import {
  calcularTotales,
  generarClaveNumerica,
  generarConsecutivo,
  calcularFechaMinima,
} from './utils/factura.js'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const LS_PEDIDOS = 'kc_pedidos'

export function AppProvider({ children }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [pantalla, setPantalla] = useState('home') // navegacion
  const [productoActivo, setProductoActivo] = useState(null)
  const [carrito, setCarrito] = useState([])
  const [ultimoPedido, setUltimoPedido] = useState(null)
  const [pedidos, setPedidos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_PEDIDOS)) || []
    } catch {
      return []
    }
  })

  // Carga inicial desde el .txt (base de datos)
  useEffect(() => {
    cargarProductos()
      .then((data) => {
        setProductos(data)
        setCargando(false)
      })
      .catch((e) => {
        setError(e.message)
        setCargando(false)
      })
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_PEDIDOS, JSON.stringify(pedidos))
  }, [pedidos])

  // ----- Navegacion -----
  const ir = (p) => {
    setPantalla(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const verProducto = (prod) => {
    setProductoActivo(prod)
    ir('detalle')
  }

  // ----- Carrito -----
  const agregarAlCarrito = (prod, cantidad = 1) => {
    if (prod.stock <= 0) return false
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === prod.id)
      if (existe) {
        const nuevaCant = Math.min(existe.cantidad + cantidad, prod.stock)
        return prev.map((i) => (i.id === prod.id ? { ...i, cantidad: nuevaCant } : i))
      }
      return [...prev, { ...prod, cantidad: Math.min(cantidad, prod.stock) }]
    })
    return true
  }
  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i
          const max = productos.find((p) => p.id === id)?.stock ?? i.stock
          return { ...i, cantidad: Math.min(Math.max(1, i.cantidad + delta), max) }
        })
        .filter((i) => i.cantidad > 0),
    )
  }
  const quitarDelCarrito = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id))
  const vaciarCarrito = () => setCarrito([])

  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0)
  const totales = useMemo(() => calcularTotales(carrito), [carrito])

  // Horas acumuladas en cola de produccion (pedidos pendientes)
  const horasCola = useMemo(
    () =>
      pedidos
        .filter((p) => ['pendiente', 'en preparacion'].includes(p.estado))
        .reduce((a, p) => a + (p.horasPedido || 0), 0),
    [pedidos],
  )

  const horasPedidoActual = carrito.reduce((a, i) => a + i.tiempoHoras * i.cantidad, 0)

  // ----- Confirmar pedido + emitir factura electronica -----
  const confirmarPedido = (cliente, metodoEntrega) => {
    const numero = 1000 + pedidos.length + 1
    const consecutivoNum = pedidos.length + 1
    const t = calcularTotales(carrito)
    const { dias, fecha } = calcularFechaMinima(horasCola, horasPedidoActual)

    const pedido = {
      id: numero,
      consecutivo: generarConsecutivo(consecutivoNum),
      clave: generarClaveNumerica(consecutivoNum),
      cliente,
      metodoEntrega,
      items: carrito.map((i) => ({
        id: i.id,
        nombre: i.nombre,
        cabys: i.cabys,
        precio: i.precio,
        cantidad: i.cantidad,
      })),
      ...t,
      estado: 'pendiente',           // estado del pedido (cola de produccion)
      estadoHacienda: 'En proceso',  // estado del comprobante ante Hacienda
      horasPedido: horasPedidoActual,
      diasEstimados: dias,
      fechaEntrega: fecha.toISOString(),
      fechaEmision: new Date().toISOString(),
      notaCredito: null,
    }

    // Rebajar stock en memoria (los pedidos no persisten cambios del .txt, solo runtime)
    setProductos((prev) =>
      prev.map((p) => {
        const enCarrito = carrito.find((c) => c.id === p.id)
        return enCarrito ? { ...p, stock: Math.max(0, p.stock - enCarrito.cantidad) } : p
      }),
    )

    setPedidos((prev) => [pedido, ...prev])
    setUltimoPedido(pedido)
    vaciarCarrito()
    ir('confirmacion')

    // Simula respuesta de Hacienda (TRIBU-CR) tras unos segundos
    setTimeout(() => {
      setPedidos((prev) =>
        prev.map((p) => (p.id === numero ? { ...p, estadoHacienda: 'Aceptado' } : p)),
      )
      setUltimoPedido((u) => (u && u.id === numero ? { ...u, estadoHacienda: 'Aceptado' } : u))
    }, 4000)

    return pedido
  }

  // Panel propietario: cambiar estado del pedido
  const cambiarEstadoPedido = (id, estado) => {
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)))
  }

  // Reemitir nota de credito (anula comprobante)
  const emitirNotaCredito = (id) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              estadoHacienda: 'Anulado',
              notaCredito: {
                clave: generarClaveNumerica(9000 + id),
                fecha: new Date().toISOString(),
              },
            }
          : p,
      ),
    )
  }

  const value = {
    productos, cargando, error,
    pantalla, ir, productoActivo, verProducto,
    carrito, agregarAlCarrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito,
    totalItems, totales, horasCola, horasPedidoActual,
    pedidos, ultimoPedido, confirmarPedido, cambiarEstadoPedido, emitirNotaCredito,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
