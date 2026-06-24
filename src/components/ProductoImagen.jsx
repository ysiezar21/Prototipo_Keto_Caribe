import { useState } from 'react'

// Muestra la imagen del producto (URL en productos.txt, generada por IA segun el platillo).
// Mientras la imagen carga/genera se ve el emoji de respaldo; la foto aparece con fade-in.
// Si la imagen falla, se queda el emoji.
export default function ProductoImagen({ producto, className = '', emojiClassName = 'text-6xl' }) {
  const [estado, setEstado] = useState('cargando') // cargando | ok | error

  const hayImagen = Boolean(producto?.imagen) && estado !== 'error'

  return (
    <span className="relative grid h-full w-full place-items-center overflow-hidden">
      {estado !== 'ok' && <span className={emojiClassName}>{producto?.emoji}</span>}
      {hayImagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          onLoad={() => setEstado('ok')}
          onError={() => setEstado('error')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            estado === 'ok' ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </span>
  )
}
