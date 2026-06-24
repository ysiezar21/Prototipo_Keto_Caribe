import { useState } from 'react'

// Muestra la foto real del producto (URL en productos.txt).
// Si la imagen falla o no existe, cae automaticamente al emoji de respaldo.
export default function ProductoImagen({ producto, className = '', emojiClassName = 'text-6xl' }) {
  const [error, setError] = useState(false)

  if (!producto?.imagen || error) {
    return <span className={emojiClassName}>{producto?.emoji}</span>
  }

  return (
    <img
      src={producto.imagen}
      alt={producto.nombre}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  )
}
