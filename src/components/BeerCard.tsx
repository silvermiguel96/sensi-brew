import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Beer } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { BeerGlass } from './BeerGlass'
import { textoRango } from '../lib/rango'
import { srmRangeToColor, srmToColor } from '../lib/srm'

interface BeerCardProps {
  beer: Beer
  index: number
  /** Término de búsqueda activo, para resaltar las coincidencias. */
  query?: string
}

/**
 * Divide `texto` en fragmentos y envuelve en `<mark>` las coincidencias
 * de `query` (case-insensitive, sin dependencias).
 */
function resaltar(texto: string, query?: string): ReactNode {
  const q = query?.trim()
  if (!q) return texto
  const lower = texto.toLowerCase()
  const needle = q.toLowerCase()
  const partes: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < texto.length) {
    const idx = lower.indexOf(needle, i)
    if (idx === -1) {
      partes.push(texto.slice(i))
      break
    }
    if (idx > i) partes.push(texto.slice(i, idx))
    partes.push(
      <mark key={key++} className="bg-transparent font-semibold text-sb-accent">
        {texto.slice(idx, idx + needle.length)}
      </mark>,
    )
    i = idx + needle.length
  }
  return partes
}

/** Tarjeta de estilo para el listado del Home. */
export function BeerCard({ beer, index, query }: BeerCardProps) {
  const reduceMotion = useReducedMotion()
  const { ibu, srm, abv } = beer.estadisticas_vitales
  const srmMid = srm ? (srm[0] + srm[1]) / 2 : 10
  const color = srm ? srmRangeToColor(srm) : srmToColor(srmMid)

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
        delay: reduceMotion ? 0 : Math.min(index, 8) * 0.05,
      }}
    >
      <Link
        to={`/estilo/${beer.id}`}
        className="glass-panel glow-hover group relative flex items-center gap-3 overflow-hidden rounded-2xl p-4 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none lg:gap-3.5"
      >
        {/* Resplandor del color SRM de la cerveza */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 100% at 100% 0%, ${color}14, transparent 55%)`,
          }}
        />
        {/* Borde teñido con el color SRM al hacer hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${color}55` }}
        />

        <div className="relative min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-xs font-bold text-sb-accent">
              {beer.id}
            </span>
            <span className="truncate text-xs text-sb-muted">
              {resaltar(beer.categoria, query)}
            </span>
          </div>

          <h2 className="mt-2 line-clamp-2 font-serif text-xl font-medium tracking-normal text-sb-title transition-colors duration-200 group-hover:text-sb-accent">
            {resaltar(beer.nombre_estilo, query)}
          </h2>

          <p className="mt-1 text-xs tabular-nums text-sb-muted">
            IBU {textoRango(ibu)}
            <span className="mx-1.5 text-zinc-600">·</span>
            SRM {textoRango(srm)}
            <span className="mx-1.5 text-zinc-600">·</span>
            ABV {textoRango(abv)}
            {abv ? '%' : ''}
          </p>
          <p className="mt-1 text-xs text-sb-muted">
            {beer.tipo_vaso.tipo} · {beer.tipo_vaso.capacidad_ml} ml
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {beer.perfil_sensorial.burbujas_descriptores.slice(0, 3).map((d) => (
              <span
                key={d}
                className="rounded-full bg-sb-fill px-2.5 py-0.5 text-[11px] font-medium text-sb-muted"
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <BeerGlass
          srm={srmMid}
          tipo={beer.tipo_vaso.tipo}
          bubbles={false}
          className="relative h-32 w-20 shrink-0 lg:h-28 lg:w-16"
        />

        <ChevronRight className="relative h-5 w-5 shrink-0 text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-sb-accent" />
      </Link>
    </motion.div>
  )
}
