import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface SectionTitleProps {
  icon?: ReactNode
  title: string
  hint?: string
}

/** Título de sección con icono, usado en la vista de detalle. */
export function SectionTitle({ icon, title, hint }: SectionTitleProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="mb-4 flex items-center gap-2.5"
    >
      {icon && <span className="text-amber-400">{icon}</span>}
      <h2 className="text-lg font-semibold tracking-wide text-zinc-100">{title}</h2>
      {hint && <span className="text-xs font-medium text-zinc-400">{hint}</span>}
    </motion.div>
  )
}
