import type { EstadisticasVitales, Rango } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { Droplet, Flame, Percent } from 'lucide-react'
import { SRM_GRADIENT } from '../lib/srm'

interface VitalStatProps {
  label: string
  unit: string
  range: [number, number]
  max: number
  icon: React.ReactNode
  segmentClass: string
  trackStyle?: React.CSSProperties
}

function VitalStat({
  label,
  unit,
  range,
  max,
  icon,
  segmentClass,
  trackStyle,
}: VitalStatProps) {
  const reduceMotion = useReducedMotion()
  const [min, maxVal] = range
  const left = Math.max(0, (min / max) * 100)
  const width = Math.max(3, ((maxVal - min) / max) * 100)

  const format = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          {icon}
          {label}
        </span>
        <span className="text-sm font-bold text-slate-100 tabular-nums">
          {format(min)}–{format(maxVal)}{' '}
          <span className="font-medium text-slate-400">{unit}</span>
        </span>
      </div>

      <div
        className="relative h-2.5 overflow-hidden rounded-full bg-slate-700 ring-1 ring-slate-600/60"
        style={trackStyle}
      >
        <motion.div
          className={`absolute inset-y-0 rounded-full ${segmentClass}`}
          style={{ left: `${left}%`, width: `${width}%` }}
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </div>
    </div>
  )
}

function FilaVital(props: Omit<VitalStatProps, 'range'> & { range: Rango | null }) {
  if (!props.range) {
    return (
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-300 uppercase">
          {props.icon}
          {props.label}
        </span>
        <span className="text-sm font-medium text-slate-400">Variable</span>
      </div>
    )
  }

  return <VitalStat {...props} range={props.range} />
}

/** Muestra las tres estadísticas vitales (IBU / SRM / ABV) con su rango. */
export function VitalesBar({ estadisticas }: { estadisticas: EstadisticasVitales }) {
  return (
    <div className="space-y-5">
      <FilaVital
        label="Amargor"
        unit="IBU"
        range={estadisticas.ibu}
        max={100}
        icon={<Flame className="h-3.5 w-3.5" />}
        segmentClass="bg-linear-to-r from-amber-700 via-amber-500 to-amber-400"
      />
      <FilaVital
        label="Color"
        unit="SRM"
        range={estadisticas.srm}
        max={40}
        icon={<Droplet className="h-3.5 w-3.5" />}
        segmentClass="bg-amber-400"
        trackStyle={{ background: SRM_GRADIENT }}
      />
      <FilaVital
        label="Alcohol"
        unit="% vol"
        range={estadisticas.abv}
        max={12}
        icon={<Percent className="h-3.5 w-3.5" />}
        segmentClass="bg-linear-to-r from-slate-400 via-amber-500 to-amber-300"
      />
    </div>
  )
}
