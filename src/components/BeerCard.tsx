import { Link } from 'react-router-dom'
import type { Beer } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { BeerGlass } from './BeerGlass'
import { srmRangeToColor } from '../lib/srm'

interface BeerCardProps {
  beer: Beer
  index: number
}

/** Tarjeta de estilo para el listado del Home. */
export function BeerCard({ beer, index }: BeerCardProps) {
  const reduceMotion = useReducedMotion()
  const srmMid = (beer.estadisticas_vitales.srm[0] + beer.estadisticas_vitales.srm[1]) / 2
  const color = srmRangeToColor(beer.estadisticas_vitales.srm)

  return (
    <motion.div
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : index * 0.06 }}
    >
      <Link
        to={`/estilo/${beer.id}`}
        className="glass-panel group relative flex items-center gap-4 overflow-hidden rounded-2xl p-5 transition-colors duration-300 hover:border-amber-400/40 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
      >
        {/* Resplandor del color SRM de la cerveza */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 100% at 100% 0%, ${color}26, transparent 55%)`,
          }}
        />

        <div className="relative min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-xs font-bold text-amber-400 ring-1 ring-amber-400/30">
              {beer.id}
            </span>
            <span className="truncate text-xs text-slate-400">{beer.categoria}</span>
          </div>

          <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-300">
            {beer.nombre_estilo}
          </h3>

          <p className="mt-1 text-xs tabular-nums text-slate-300">
            IBU {beer.estadisticas_vitales.ibu[0]}–{beer.estadisticas_vitales.ibu[1]}
            <span className="mx-1.5 text-slate-500">·</span>
            SRM {beer.estadisticas_vitales.srm[0]}–{beer.estadisticas_vitales.srm[1]}
            <span className="mx-1.5 text-slate-500">·</span>
            ABV {beer.estadisticas_vitales.abv[0]}–{beer.estadisticas_vitales.abv[1]}%
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {beer.perfil_sensorial.burbujas_descriptores.slice(0, 3).map((d) => (
              <span
                key={d}
                className="rounded-full bg-slate-700/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-slate-600"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <BeerGlass srm={srmMid} className="relative h-32 w-20 shrink-0" />

        <ChevronRight className="relative h-5 w-5 shrink-0 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-400" />
      </Link>
    </motion.div>
  )
}
