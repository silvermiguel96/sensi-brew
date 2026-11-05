import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface SectionTitleProps {
  icon?: ReactNode
  title: string
  hint?: string
}

/** Section title with an optional icon, used on the detail view. */
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
      {icon && <span className="text-sb-accent">{icon}</span>}
      <h2 className="font-serif text-lg font-medium tracking-wide text-sb-text">
        {title}
      </h2>
      {hint && <span className="text-xs font-medium text-sb-muted">{hint}</span>}
    </motion.div>
  )
}
