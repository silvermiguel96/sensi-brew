import type { TechnicalSpec } from '../../types/beerStyle'
import { motion, useReducedMotion } from 'framer-motion'

interface TechnicalStatCardProps {
  icon: React.ReactNode
  spec: TechnicalSpec
  /** Retraso de entrada escalonada entre las 3 tarjetas. */
  delay?: number
}

const format = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

/** Celda de estadística técnica con barra de rango sobre la escala estándar. */
export function TechnicalStatCard({ icon, spec, delay = 0 }: TechnicalStatCardProps) {
  const reduceMotion = useReducedMotion()
  const span = spec.scaleMax - spec.scaleMin
  const left = ((spec.min - spec.scaleMin) / span) * 100
  const width = ((spec.max - spec.min) / span) * 100

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1], delay }}
      className="p-5 sm:p-6"
    >
      <div className="flex items-center gap-2">
        <span className="text-sb-accent" aria-hidden>
          {icon}
        </span>
        <h3 className="text-xs font-medium tracking-widest text-sb-muted uppercase">
          {spec.label}
        </h3>
      </div>

      <p className="mt-4 text-2xl font-medium tracking-tight text-sb-text tabular-nums">
        {format(spec.min)} – {format(spec.max)}{' '}
        <span className="text-sm font-semibold text-sb-muted">{spec.unit}</span>
      </p>

      {/* Barra de rango dentro de la escala estándar */}
      <div className="mt-4">
        <div
          className="relative h-2 overflow-hidden rounded-full bg-sb-bg ring-1 ring-sb-border"
          role="img"
          aria-label={`Rango ${format(spec.min)} a ${format(spec.max)} ${spec.unit} dentro de una escala de ${format(spec.scaleMin)} a ${format(spec.scaleMax)}`}
        >
          <motion.div
            className="absolute inset-y-0 rounded-full bg-amber-500"
            style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: delay + 0.2 }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-medium text-sb-muted tabular-nums">
          <span>
            {format(spec.scaleMin)} {spec.unit}
          </span>
          <span>
            {format(spec.scaleMax)} {spec.unit}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
