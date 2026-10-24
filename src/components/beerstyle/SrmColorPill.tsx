import { motion, useReducedMotion } from 'framer-motion'

interface SrmColorPillProps {
  hex: string
  min: number
  max: number
}

/** Círculo con relleno dinámico del color HEX del estilo + etiqueta SRM. */
export function SrmColorPill({ hex, min, max }: SrmColorPillProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
      className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-zinc-950/60 py-1.5 pr-4 pl-1.5 backdrop-blur"
    >
      <span
        className="h-7 w-7 rounded-full ring-2 ring-white/25 ring-inset shadow-[0_0_12px_rgba(0,0,0,0.4)]"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className="text-xs leading-tight">
        <span className="block font-bold text-zinc-100 tabular-nums">
          SRM {min}–{max}
        </span>
        <span className="block text-[10px] font-medium tracking-widest text-zinc-400 uppercase">
          Color {hex}
        </span>
      </span>
    </motion.div>
  )
}
