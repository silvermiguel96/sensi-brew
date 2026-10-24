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
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="rounded-2xl p-6"
    >
      <div className="flex items-center gap-3">
        <span className="text-amber-400" aria-hidden>
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-zinc-50 capitalize">{pairing.categoria}</h3>
      </div>

      <p className="mt-4 text-pretty text-sm leading-relaxed text-zinc-300">
        {pairing.descripcion}
      </p>

      <ul className="mt-5 divide-y divide-white/5 border-y border-white/5">
        {pairing.platos.map((plato, i) => (
          <motion.li
            key={plato}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
            className="flex items-center gap-2.5 py-2.5"
          >
            <Check className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />
            <span className="text-sm font-medium text-zinc-300">{plato}</span>
          </motion.li>
        ))}
      </ul>
    </motion.article>
  )
}
