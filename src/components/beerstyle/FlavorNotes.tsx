import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface FlavorNotesProps {
  notas: string[]
}

/** Notas de sabor en forma de chips con entrada escalonada. */
export function FlavorNotes({ notas }: FlavorNotesProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex flex-wrap gap-2">
      {notas.map((nota, i) => (
        <motion.span
          key={nota}
          initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: i * 0.05 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-200"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          {nota}
        </motion.span>
      ))}
    </div>
  )
}
