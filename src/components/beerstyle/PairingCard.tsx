import type { FoodPairing } from '../../types/beerStyle'
import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

interface PairingCardProps {
  pairing: FoodPairing
  icon: React.ReactNode
}

/** Tarjeta de una categoría de maridaje: icono, descripción y lista de platos. */
export function PairingCard({ pairing, icon }: PairingCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6"
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-xl bg-amber-500/12 text-amber-400 ring-1 ring-amber-500/25"
          aria-hidden
        >
          {icon}
        </span>
        <h3 className="text-lg font-bold text-slate-50 capitalize">{pairing.categoria}</h3>
      </div>

      <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-300">
        {pairing.descripcion}
      </p>

      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {pairing.platos.map((plato, i) => (
          <motion.li
            key={plato}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.06 }}
            className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5"
          >
            <Check className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span className="text-sm font-medium text-slate-200">{plato}</span>
          </motion.li>
        ))}
      </ul>
    </motion.article>
  )
}
