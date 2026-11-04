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
        <span className="text-sb-accent" aria-hidden>
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-sb-title capitalize">{pairing.categoria}</h3>
      </div>

      <p className="mt-4 text-pretty text-sm leading-relaxed text-sb-body">
        {pairing.descripcion}
      </p>

      <ul className="mt-5 divide-y divide-sb-border border-y border-sb-border">
        {pairing.platos.map((plato, i) => (
          <motion.li
            key={plato}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
            className="flex items-center gap-2.5 py-2.5"
          >
            <Check className="h-4 w-4 shrink-0 text-sb-accent" aria-hidden />
            <span className="text-sm font-medium text-sb-body">{plato}</span>
          </motion.li>
        ))}
      </ul>
    </motion.article>
  )
}
