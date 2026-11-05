import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Beer } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { BeerGlass } from './BeerGlass'
import { formatRange } from '../lib/range'
import { srmMid, srmToColor } from '../lib/srm'

interface BeerCardProps {
  beer: Beer
  index: number
  /** Active search term, used to highlight matches. */
  query?: string
}

/**
 * Splits `text` into fragments and wraps the `query` matches in `<mark>`
 * (case-insensitive, no dependencies).
 */
function highlight(text: string, query?: string): ReactNode {
  const q = query?.trim()
  if (!q) return text
  const lower = text.toLowerCase()
  const needle = q.toLowerCase()
  const parts: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < text.length) {
    const idx = lower.indexOf(needle, i)
    if (idx === -1) {
      parts.push(text.slice(i))
      break
    }
    if (idx > i) parts.push(text.slice(i, idx))
    parts.push(
      <mark key={key++} className="bg-transparent font-semibold text-sb-accent">
        {text.slice(idx, idx + needle.length)}
      </mark>,
    )
    i = idx + needle.length
  }
  return parts
}

/** Style card for the Home list. */
export function BeerCard({ beer, index, query }: BeerCardProps) {
  const reduceMotion = useReducedMotion()
  const { ibu, srm, abv } = beer.vitalStats
  const mid = srmMid(srm)
  const color = srmToColor(mid)

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
        {/* Glow in the beer's SRM color */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(120% 100% at 100% 0%, ${color}14, transparent 55%)`,
          }}
        />
        {/* Border tinted with the SRM color on hover */}
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
              {highlight(beer.category, query)}
            </span>
          </div>

          <h2 className="mt-2 line-clamp-2 font-serif text-xl font-medium tracking-normal text-sb-title transition-colors duration-200 group-hover:text-sb-accent">
            {highlight(beer.name, query)}
          </h2>

          <p className="mt-1 text-xs tabular-nums text-sb-muted">
            IBU {formatRange(ibu)}
            <span className="mx-1.5 text-zinc-600">·</span>
            SRM {formatRange(srm)}
            <span className="mx-1.5 text-zinc-600">·</span>
            ABV {formatRange(abv)}
            {abv ? '%' : ''}
          </p>
          <p className="mt-1 text-xs text-sb-muted">
            {beer.glass.type} · {beer.glass.capacityMl} ml
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {beer.sensoryProfile.descriptors.slice(0, 3).map((d) => (
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
          srm={mid}
          type={beer.glass.type}
          bubbles={false}
          className="relative h-32 w-20 shrink-0 lg:h-28 lg:w-16"
        />

        <ChevronRight className="relative h-5 w-5 shrink-0 text-zinc-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-sb-accent" />
      </Link>
    </motion.div>
  )
}
