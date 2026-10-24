import type { Maridaje } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { FlaskConical, UtensilsCrossed } from 'lucide-react'
import { SectionTitle } from './SectionTitle'

interface MaridajeCardProps {
  maridaje: Maridaje
  title?: string
}

/** Tarjeta de maridaje gastronómico con su justificación química. */
export function MaridajeCard({ maridaje, title = 'Maridaje recomendado' }: MaridajeCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { scale: 1.01, y: -2 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl p-5 sm:p-6"
    >
      <SectionTitle
        icon={<UtensilsCrossed className="h-4 w-4" />}
        title={title}
      />

      <p className="text-balance-es text-xl font-bold text-amber-300">
        {maridaje.plato}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {maridaje.ingredientes_clave.map((ing) => (
          <span
            key={ing}
            className="rounded-full bg-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-600"
          >
            {ing}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-amber-400 uppercase">
          <FlaskConical className="h-3.5 w-3.5" />
          Justificación química
        </p>
        <p className="text-pretty text-sm leading-relaxed text-slate-200">
          {maridaje.justificacion_quimica}
        </p>
      </div>
    </motion.div>
  )
}
