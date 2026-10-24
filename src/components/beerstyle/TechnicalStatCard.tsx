import type { TechnicalSpec } from '../../types/beerStyle'
import { motion, useReducedMotion } from 'framer-motion'

interface TechnicalStatCardProps {
  icon: React.ReactNode
  accentClass: string
  spec: TechnicalSpec
  /** Retraso de entrada escalonada entre las 3 tarjetas. */
  delay?: number
}

const format = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

/** Tarjeta de estadística técnica con barra de rango sobre la escala estándar. */
export function TechnicalStatCard({
  icon,
  accentClass,
  spec,
  delay = 0,
}: TechnicalStatCardProps) {
  const reduceMotion = useReducedMotion()
  const span = spec.scaleMax - spec.scaleMin
  const left = ((spec.min - spec.scaleMin) / span) * 100
  const width = ((spec.max - spec.min) / span) * 100

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-center gap-2">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl bg-slate-900 ring-1 ring-slate-700 ${accentClass}`}
          aria-hidden
        >
          {icon}
        </span>
        <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {spec.label}
        </h3>
      </div>

      <p className="mt-4 text-2xl font-black tracking-tight text-slate-50 tabular-nums">
        {format(spec.min)} – {format(spec.max)}{' '}
        <span className="text-sm font-semibold text-slate-400">{spec.unit}</span>
      </p>

      {/* Barra de rango dentro de la escala estándar */}
      <div className="mt-4">
        <div
          className="relative h-2 overflow-hidden rounded-full bg-slate-900 ring-1 ring-slate-700/70"
          role="img"
          aria-label={`Rango ${format(spec.min)} a ${format(spec.max)} ${spec.unit} dentro de una escala de ${format(spec.scaleMin)} a ${format(spec.scaleMax)}`}
        >
          <motion.div
            className="absolute inset-y-0 rounded-full bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500"
            style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + 0.2 }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-500 tabular-nums">
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
