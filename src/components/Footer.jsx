import { MapPin, Phone, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 bg-keto-dark text-cream/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber font-display font-bold text-keto-dark">
              K
            </div>
            <p className="font-display text-lg font-bold text-cream">Keto Caribe</p>
          </div>
          <p className="text-sm text-cream/70">
            Repostería artesanal keto en Limón. Pedidos en línea con entrega coordinada y
            facturación electrónica válida ante Hacienda.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><Clock size={16} className="text-amber" /> Lun a Sáb · 8:00 a.m. – 6:00 p.m.</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-amber" /> WhatsApp: +506 8888-0000</p>
          <p className="flex items-center gap-2"><MapPin size={16} className="text-amber" /> Servicio de entregas · Limón y Caribe</p>
        </div>
        <div className="text-sm text-cream/60">
          <p className="font-display font-semibold text-cream">Prototipo académico</p>
          <p className="mt-1">IC4810 – Administración de Proyectos · Proyecto 3</p>
          <p>Grupo 4 · TEC · Semestre I 2026</p>
          <p className="mt-2 text-xs">Datos de demostración cargados desde <code>productos.txt</code></p>
        </div>
      </div>
      <div className="border-t border-white/10 py-3 text-center text-xs text-cream/50">
        © 2026 Keto Caribe — Prototipo navegable de alta fidelidad
      </div>
    </footer>
  )
}
