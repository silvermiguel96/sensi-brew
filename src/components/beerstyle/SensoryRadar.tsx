import type { SensoryProfile } from '../../types/beerStyle'
import { SENSORY_AXES } from '../../types/beerStyle'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { motion, useReducedMotion } from 'framer-motion'

interface SensoryRadarProps {
  perfil: SensoryProfile
  hex: string
  height?: number
}

/** Radar organoléptico (1–5) de seis ejes. La animación va en el contenedor. */
export function SensoryRadar({ perfil, hex, height = 320 }: SensoryRadarProps) {
  const reduceMotion = useReducedMotion()

  const data = SENSORY_AXES.map((eje) => ({
    eje: eje.label,
    valor: Math.min(5, Math.max(1, perfil[eje.key])),
  }))

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="72%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
          <PolarGrid stroke="#334155" strokeDasharray="3 4" />
          <PolarAngleAxis
            dataKey="eje"
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
          <Radar
            dataKey="valor"
            stroke={hex}
            strokeWidth={2}
            fill={hex}
            fillOpacity={0.3}
            isAnimationActive={!reduceMotion}
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
