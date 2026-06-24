// Carga y parseo de la "base de datos" en texto plano (productos.txt).
// El archivo vive en /public/data/productos.txt y se trae por fetch en tiempo de ejecucion,
// simulando una fuente de datos externa para hacer el prototipo mas interactivo.

const CAMPOS = [
  'id', 'nombre', 'categoria', 'precio', 'stock', 'umbral', 'tiempoHoras',
  'cabys', 'emoji', 'imagen', 'descripcion', 'ingredientes',
  'calorias', 'carbos', 'proteina', 'grasa',
]

export async function cargarProductos() {
  const res = await fetch(`${import.meta.env.BASE_URL}data/productos.txt`)
  if (!res.ok) throw new Error('No se pudo cargar la base de datos de productos')
  const texto = await res.text()

  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))
    .map((linea) => {
      const partes = linea.split('|')
      const obj = {}
      CAMPOS.forEach((campo, i) => {
        obj[campo] = (partes[i] ?? '').trim()
      })
      return {
        id: Number(obj.id),
        nombre: obj.nombre,
        categoria: obj.categoria,
        precio: Number(obj.precio),
        stock: Number(obj.stock),
        umbral: Number(obj.umbral),
        tiempoHoras: Number(obj.tiempoHoras),
        cabys: obj.cabys,
        emoji: obj.emoji,
        imagen: obj.imagen,
        descripcion: obj.descripcion,
        ingredientes: obj.ingredientes.split(',').map((s) => s.trim()),
        nutricion: {
          calorias: Number(obj.calorias),
          carbos: Number(obj.carbos),
          proteina: Number(obj.proteina),
          grasa: Number(obj.grasa),
        },
      }
    })
}
