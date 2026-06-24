// Utilidades de facturacion electronica de Costa Rica (Hacienda v4.4 / TRIBU-CR).
// Integracion nueva del Evento C - Grupo 4.

export const IVA = 0.13 // Tarifa general de IVA en Costa Rica

export const formatCRC = (n) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n))

const pad = (num, len) => String(num).padStart(len, '0')
const rand = (len) =>
  Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('')

// Clave numerica de 50 digitos segun estructura de Hacienda:
// pais(3) + dia(2) + mes(2) + anio(2) + cedula(12) + consecutivo(20) + situacion(1) + cod.seguridad(8)
export function generarClaveNumerica(consecutivoNum) {
  const hoy = new Date()
  const pais = '506'
  const fecha = pad(hoy.getDate(), 2) + pad(hoy.getMonth() + 1, 2) + pad(hoy.getFullYear() % 100, 2)
  const cedula = pad('310123456', 12) // cedula juridica de Keto Caribe (demo)
  const consecutivo = pad(consecutivoNum, 20)
  const situacion = '1' // 1 = normal
  const seguridad = rand(8)
  return pais + fecha + cedula + consecutivo + situacion + seguridad
}

// Consecutivo de comprobante (20 digitos): sucursal(3)+terminal(5)+tipo(2)+numero(10)
export function generarConsecutivo(numero) {
  return '001' + '00001' + '01' + pad(numero, 10)
}

// Calcula subtotal, IVA y total de las lineas del carrito (precio incluye IVA -> se desglosa)
export function calcularTotales(items) {
  // En CR los precios al publico suelen incluir IVA; desglosamos para el comprobante.
  const totalConIva = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0)
  const subtotal = totalConIva / (1 + IVA)
  const iva = totalConIva - subtotal
  return {
    subtotal: Math.round(subtotal),
    iva: Math.round(iva),
    total: Math.round(totalConIva),
  }
}

// Cola de produccion (US-008): fecha minima en que el pedido puede estar listo.
// fecha = hoy + ceil((horasCola + horasPedido) / horasDiarias)
export function calcularFechaMinima(horasCola, horasPedido, horasDiarias = 4) {
  const dias = Math.max(1, Math.ceil((horasCola + horasPedido) / horasDiarias))
  const f = new Date()
  f.setDate(f.getDate() + dias)
  return { dias, fecha: f }
}

export function formatFecha(fecha) {
  return new Intl.DateTimeFormat('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(fecha)
}

export function formatFechaCorta(fecha) {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fecha)
}
