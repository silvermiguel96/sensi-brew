import type { SensoryIntensity } from '../types/beer'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { motion, useReducedMotion } from 'framer-motion'

const AXES: Array<{ key: keyof SensoryIntensity; label: string }> = [
  { key: 'bitterness', label: 'Amargor' },
  { key: 'malt', label: 'Malta' },
  { key: 'hops', label: 'Lúpulo' },
  { key: 'body', label: 'Cuerpo' },
  { key: 'carbonation', label: 'Carbonatación' },
  { key: 'fruityEsters', label: 'Ésteres' },
]

interface SensoryRadarProps {
  intensity: SensoryIntensity
  height?: number
}

/**
 * Sensory radar (Recharts). The animation is applied to the container,
 * never to Recharts' internal <path> elements, to avoid conflicts.
 */
export function SensoryRadar({ intensity, height = 300 }: SensoryRadarProps) {
  const reduceMotion = useReducedMotion()

  const data = AXES.map((axis) => ({
    axis: axis.label,
    value: intensity[axis.key],
  }))

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className="radar-amber w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="72%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="#27272a" strokeDasharray="3 4" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="#fbbf24"
            strokeWidth={2}
            fill="#fbbf24"
            fillOpacity={0.2}
            isAnimationActive={!reduceMotion}
            animationDuration={800}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
