import type { Pairing } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { FlaskConical, UtensilsCrossed } from 'lucide-react'
import { SectionTitle } from './SectionTitle'

interface PairingCardProps {
  pairing: Pairing
  title?: string
}

/** Food pairing card with its chemical justification. */
export function PairingCard({ pairing, title = 'Maridaje recomendado' }: PairingCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { scale: 1.01, y: -2 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="glass-panel rounded-2xl p-5 sm:p-6"
    >
      <SectionTitle
        icon={<UtensilsCrossed className="h-4 w-4" />}
        title={title}
      />

      <p className="text-balance text-xl font-semibold text-sb-accent">
        {pairing.dish}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {pairing.keyIngredients.map((ingredient) => (
          <span
            key={ingredient}
            className="rounded-full bg-sb-fill px-2.5 py-1 text-xs font-medium text-sb-body"
          >
            {ingredient}
          </span>
        ))}
      </div>

      <div className="mt-4 border-l-2 border-amber-500/30 pl-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-sb-accent uppercase">
          <FlaskConical className="h-3.5 w-3.5" />
          Justificación química
        </p>
        <p className="text-pretty text-sm leading-relaxed text-sb-body">
          {pairing.chemistry}
        </p>
      </div>
    </motion.div>
  )
}
