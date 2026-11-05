import type { Range, VitalStats as VitalStatsData } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { Droplet, Flame, Percent } from 'lucide-react'
import { SRM_GRADIENT } from '../lib/srm'

interface StatBarProps {
  label: string
  unit: string
  range: Range
  max: number
  icon: React.ReactNode
  segmentClass: string
  trackStyle?: React.CSSProperties
}

function StatBar({
  label,
  unit,
  range,
  max,
  icon,
  segmentClass,
  trackStyle,
}: StatBarProps) {
  const reduceMotion = useReducedMotion()
  const [min, maxVal] = range
  const left = Math.max(0, (min / max) * 100)
  const width = Math.max(3, ((maxVal - min) / max) * 100)

  const format = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-widest text-sb-muted uppercase">
          {icon}
          {label}
        </span>
        <span className="text-sm font-medium text-sb-text tabular-nums">
          {format(min)}–{format(maxVal)}{' '}
          <span className="font-medium text-sb-muted">{unit}</span>
        </span>
      </div>

      <div
        className="relative h-2.5 overflow-hidden rounded-full bg-sb-fill-strong ring-1 ring-sb-border"
        style={trackStyle}
      >
        <motion.div
          className={`absolute inset-y-0 rounded-full ${segmentClass}`}
          style={{ left: `${left}%`, width: `${width}%` }}
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
        />
      </div>
    </div>
  )
}

function StatRow(props: Omit<StatBarProps, 'range'> & { range: Range | null }) {
  if (!props.range) {
    return (
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium tracking-widest text-sb-muted uppercase">
          {props.icon}
          {props.label}
        </span>
        <span className="text-sm font-medium text-sb-muted">Variable</span>
      </div>
    )
  }

  return <StatBar {...props} range={props.range} />
}

/** The three vital statistics (IBU / SRM / ABV) with their ranges. */
export function VitalStats({ stats }: { stats: VitalStatsData }) {
  return (
    <div className="space-y-5">
      <StatRow
        label="Amargor"
        unit="IBU"
        range={stats.ibu}
        max={100}
        icon={<Flame className="h-3.5 w-3.5" />}
        segmentClass="bg-amber-500"
      />
      <StatRow
        label="Color"
        unit="SRM"
        range={stats.srm}
        max={40}
        icon={<Droplet className="h-3.5 w-3.5" />}
        segmentClass="bg-amber-400"
        trackStyle={{ background: SRM_GRADIENT }}
      />
      <StatRow
        label="Alcohol"
        unit="% vol"
        range={stats.abv}
        max={12}
        icon={<Percent className="h-3.5 w-3.5" />}
        segmentClass="bg-amber-500"
      />
    </div>
  )
}
