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
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 flex items-center gap-2.5"
    >
      {icon && (
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-400/12 text-amber-400 ring-1 ring-amber-400/25">
          {icon}
        </span>
      )}
      <h2 className="text-lg font-bold tracking-tight text-slate-100">{title}</h2>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </motion.div>
  )
}
