import type { RadarIntensidad } from '../types/beer'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { motion, useReducedMotion } from 'framer-motion'

const EJES: Array<{ key: keyof RadarIntensidad; label: string }> = [
  { key: 'amargor', label: 'Amargor' },
  { key: 'malta', label: 'Malta' },
  { key: 'lupulo', label: 'Lúpulo' },
  { key: 'cuerpo', label: 'Cuerpo' },
  { key: 'carbonatacion', label: 'Carbonatación' },
  { key: 'esteres_frutales', label: 'Ésteres' },
]

interface RadarPerfilProps {
  perfil: RadarIntensidad
  height?: number
}

/**
 * Radar sensorial (Recharts). La animación se aplica al contenedor,
 * nunca a los <path> internos de Recharts, para evitar conflictos.
 */
export function RadarPerfil({ perfil, height = 300 }: RadarPerfilProps) {
  const reduceMotion = useReducedMotion()

  const data = EJES.map((eje) => ({
    eje: eje.label,
    valor: perfil[eje.key],
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
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
          <Radar
            dataKey="valor"
            stroke="#fbbf24"
            strokeWidth={2}
            fill="#fbbf24"
            fillOpacity={0.32}
            isAnimationActive={!reduceMotion}
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
