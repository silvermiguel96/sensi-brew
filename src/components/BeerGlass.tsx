import { useId, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { shade, srmToColor } from '../lib/srm'

interface BeerGlassProps {
  /** SRM value used to paint the liquid. */
  srm?: number
  /** Exact `glass.type` name. Without it, the generic glass is drawn. */
  type?: string
  /** External size/position classes (the component is responsive by default). */
  className?: string
  /** Shows rising bubbles (decorative). */
  bubbles?: boolean
}

type Stem = 'thin' | 'short' | 'thick'

/** Curved bowl, plus a stem or handle when the real glass has one. */
interface Silhouette {
  /** Closed path in 0–1 coordinates so it scales with the box. */
  d: string
  top: number
  height: number
  left: number
  width: number
  /** Top edge of the foam, in % of the bowl. */
  foam: number
  stem?: Stem
  handle?: 'normal' | 'large'
}

/**
 * Classic outline of each glass in the catalog, keyed by the Spanish
 * `glass.type` value from the data.
 * Proportions from Wikipedia (Beer glassware) and Dimensions.com:
 * the Pilsner is an almost straight cone (base ~88% of the mouth), the Weizen
 * curves at the top over a wide foot, the Nonic has its bulge below the lip.
 * Handle and stem live inside the box: the card clips anything outside it.
 */
const SILHOUETTES: Record<string, Silhouette> = {
  'Copa Pilsner': {
    d: 'M0.08 0.02H0.92L0.86 0.86Q0.84 0.98 0.74 0.98H0.26Q0.16 0.98 0.14 0.86L0.08 0.02Z',
    top: 0,
    height: 100,
    left: 21,
    width: 58,
    foam: 7,
  },
  'Pinta americana (shaker)': {
    d: 'M0.06 0.03H0.94L0.8 0.86Q0.78 0.98 0.68 0.98H0.32Q0.22 0.98 0.2 0.86L0.06 0.03Z',
    top: 4,
    height: 96,
    left: 6,
    width: 88,
    foam: 8,
  },
  'Pinta Nonic': {
    d: 'M0.22 0.02C0.1 0.06 0.02 0.12 0.02 0.22C0.02 0.32 0.12 0.36 0.16 0.38L0.22 0.86Q0.24 0.98 0.32 0.98H0.68Q0.76 0.98 0.78 0.86L0.84 0.38C0.88 0.36 0.98 0.32 0.98 0.22C0.98 0.12 0.9 0.06 0.78 0.02Z',
    top: 2,
    height: 96,
    left: 7,
    width: 86,
    foam: 8,
  },
  'Vaso Willi Becher': {
    d: 'M0.28 0.02C0.1 0.1 0.04 0.22 0.06 0.38C0.1 0.62 0.14 0.8 0.16 0.88Q0.18 0.98 0.26 0.98H0.74Q0.82 0.98 0.84 0.88C0.86 0.8 0.9 0.62 0.94 0.38C0.96 0.22 0.9 0.1 0.72 0.02Z',
    top: 6,
    height: 94,
    left: 9,
    width: 82,
    foam: 6,
  },
  Becher: {
    d: 'M0.14 0.04H0.86L0.78 0.84Q0.76 0.98 0.66 0.98H0.34Q0.24 0.98 0.22 0.84L0.14 0.04Z',
    top: 22,
    height: 76,
    left: 11,
    width: 78,
    foam: 8,
  },
  Stange: {
    d: 'M0.18 0.02H0.82Q0.9 0.02 0.9 0.08V0.88Q0.9 0.98 0.78 0.98H0.22Q0.1 0.98 0.1 0.88V0.08Q0.1 0.02 0.18 0.02Z',
    top: 0,
    height: 100,
    left: 27,
    width: 46,
    foam: 6,
  },
  'Vaso cónico alto': {
    d: 'M0.04 0.02H0.96L0.74 0.86Q0.7 0.98 0.6 0.98H0.4Q0.3 0.98 0.26 0.86L0.04 0.02Z',
    top: 0,
    height: 100,
    left: 16,
    width: 68,
    foam: 6,
  },
  Flauta: {
    d: 'M0.24 0.02H0.76Q0.86 0.02 0.84 0.1L0.72 0.78Q0.66 0.98 0.5 0.98Q0.34 0.98 0.28 0.78L0.16 0.1Q0.14 0.02 0.24 0.02Z',
    top: 0,
    height: 64,
    left: 34,
    width: 32,
    foam: 8,
    stem: 'thin',
  },
  'Vaso Weizen': {
    d: 'M0.2 0.02C0.06 0.06 0.02 0.16 0.04 0.34C0.08 0.56 0.12 0.74 0.16 0.86Q0.18 0.98 0.28 0.98H0.72Q0.82 0.98 0.84 0.86C0.88 0.74 0.92 0.56 0.96 0.34C0.98 0.16 0.94 0.06 0.8 0.02Z',
    top: 0,
    height: 100,
    left: 16,
    width: 68,
    foam: 4,
  },
  Tulipán: {
    d: 'M0.14 0.04C0.3 0.12 0.36 0.2 0.38 0.3C0.24 0.46 0.1 0.58 0.14 0.72C0.2 0.88 0.32 0.98 0.42 1H0.58C0.68 0.98 0.8 0.88 0.86 0.72C0.9 0.58 0.76 0.46 0.62 0.3C0.64 0.2 0.7 0.12 0.86 0.04Z',
    top: 0,
    height: 70,
    left: 7,
    width: 86,
    foam: 8,
    stem: 'thin',
  },
  Snifter: {
    d: 'M0.34 0.04C0.18 0.14 0.04 0.34 0.04 0.55C0.04 0.8 0.22 0.98 0.42 1H0.58C0.78 0.98 0.96 0.8 0.96 0.55C0.96 0.34 0.82 0.14 0.66 0.04Z',
    top: 4,
    height: 62,
    left: 4,
    width: 92,
    foam: 10,
    stem: 'short',
  },
  Teku: {
    d: 'M0.02 0.1C0.2 0.2 0.32 0.26 0.38 0.4C0.24 0.58 0.26 0.78 0.38 0.92Q0.42 1 0.46 1H0.54Q0.58 1 0.62 0.92C0.74 0.78 0.76 0.58 0.62 0.4C0.68 0.26 0.8 0.2 0.98 0.1Z',
    top: 0,
    height: 68,
    left: 3,
    width: 94,
    foam: 24,
    stem: 'thin',
  },
  'Cáliz belga': {
    d: 'M0.06 0.06C0.04 0.28 0.12 0.5 0.24 0.72C0.32 0.9 0.4 1 0.46 1H0.54C0.6 1 0.68 0.9 0.76 0.72C0.88 0.5 0.96 0.28 0.94 0.06Z',
    top: 4,
    height: 64,
    left: 4,
    width: 92,
    foam: 8,
    stem: 'thick',
  },
  'Copa de vino blanco': {
    d: 'M0.36 0.04C0.18 0.16 0.08 0.4 0.2 0.68C0.28 0.9 0.4 1 0.46 1H0.54C0.6 1 0.72 0.9 0.8 0.68C0.92 0.4 0.82 0.16 0.64 0.04Z',
    top: 0,
    height: 46,
    left: 13,
    width: 74,
    foam: 12,
    stem: 'thin',
  },
  'Copa cuenco (Berliner)': {
    d: 'M0.04 0.18C0.02 0.42 0.16 0.82 0.4 0.98H0.6C0.84 0.82 0.98 0.42 0.96 0.18Z',
    top: 22,
    height: 42,
    left: 2,
    width: 96,
    foam: 22,
    stem: 'short',
  },
  Tumbler: {
    d: 'M0.08 0.04H0.92L0.8 0.82Q0.76 0.98 0.64 0.98H0.36Q0.24 0.98 0.2 0.82L0.08 0.04Z',
    top: 26,
    height: 74,
    left: 10,
    width: 80,
    foam: 8,
  },
  'Jarra con asa (Seidel)': {
    d: 'M0.08 0.03H0.92L0.8 0.84Q0.76 0.98 0.64 0.98H0.28Q0.16 0.98 0.14 0.84L0.08 0.03Z',
    top: 8,
    height: 90,
    left: 2,
    width: 68,
    foam: 8,
    handle: 'normal',
  },
  'Tankard (jarra grande)': {
    d: 'M0.06 0.04H0.94L0.86 0.84Q0.82 0.98 0.7 0.98H0.24Q0.12 0.98 0.1 0.84L0.06 0.04Z',
    top: 16,
    height: 82,
    left: 0,
    width: 72,
    foam: 8,
    handle: 'large',
  },
}

const STEMS: Record<Stem, { rod: string; base: string }> = {
  thin: { rod: 'w-[6%]', base: 'w-[42%]' },
  short: { rod: 'w-[10%]', base: 'w-[50%]' },
  thick: { rod: 'w-[14%]', base: 'w-[58%]' },
}

interface FillProps {
  color: string
  bubbles: boolean
  foam: number
  /** true when the glass is shown full (already in view or reduced motion). */
  full: boolean
  /** false when the user prefers reduced motion: painted full, no animation. */
  animated: boolean
}

/**
 * Liquid, bubbles, foam and shine. The parent applies the glass clipping.
 * Revealed bottom-up (clip-path) to simulate the glass being poured.
 */
function Fill({ color, bubbles, foam, full, animated }: FillProps) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={animated ? { clipPath: 'inset(100% 0 0 0)' } : false}
      animate={{ clipPath: full ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-[80%]"
        style={{
          background: `linear-gradient(180deg, ${color} 0% 55%, ${shade(color, 0.72)} 100%)`,
        }}
      />
      {bubbles && (
        <div className="absolute inset-x-0 bottom-0 h-[76%] overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => {
            const left = 18 + ((i * 23) % 64)
            const size = 3 + (i % 3) * 2
            return (
              <span
                key={i}
                className="animate-bubble absolute bottom-2 rounded-full bg-white/70"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size,
                  ['--duration' as string]: `${3 + (i % 5) * 0.7}s`,
                  ['--delay' as string]: `${i * 0.45}s`,
                  ['--rise' as string]: `-${70 + (i % 4) * 14}px`,
                }}
              />
            )
          })}
        </div>
      )}
      <div
        className="animate-foam absolute inset-x-[-4%] h-[11%] rounded-[50%] bg-foam/95 shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
        style={{ top: `${foam}%` }}
      />
      <div
        className="absolute inset-x-0 h-[8%] bg-foam/85"
        style={{ top: `${foam + 5}%` }}
      />
      <div className="absolute inset-y-[18%] left-[14%] w-1 rounded-full bg-white/25 blur-[1px]" />
    </motion.div>
  )
}

/**
 * Beer glass drawn 100% with CSS: SRM gradient liquid,
 * animated foam and bubbles. Zero image assets => zero offline weight.
 */
export function BeerGlass({ srm = 8, type, className = '', bubbles = true }: BeerGlassProps) {
  const clipId = `glass${useId().replace(/:/g, '')}`
  const containerRef = useRef<HTMLDivElement>(null)
  // The glass fills when it enters the viewport (only once).
  const inView = useInView(containerRef, { once: true, amount: 0.4 })
  const reduceMotion = useReducedMotion()
  const full = Boolean(reduceMotion) || inView
  const animated = !reduceMotion
  const color = srmToColor(srm)
  const silhouette = type ? SILHOUETTES[type] : undefined
  const label = type
    ? `${type}. Color equivalente a ${srm} SRM`
    : `Color de cerveza equivalente a ${srm} SRM`

  if (!silhouette) {
    return (
      <div
        ref={containerRef}
        className={`relative h-48 w-32 overflow-hidden rounded-b-[2.75rem] rounded-t-lg border border-sb-border bg-sb-fill shadow-[inset_0_2px_10px_rgba(0,0,0,0.35)] ${className}`}
        role="img"
        aria-label={label}
      >
        <Fill color={color} bubbles={bubbles} foam={15} full={full} animated={animated} />
      </div>
    )
  }

  const stem = silhouette.stem ? STEMS[silhouette.stem] : undefined
  const largeHandle = silhouette.handle === 'large'

  return (
    <div ref={containerRef} className={`relative ${className}`} role="img" aria-label={label}>
      {stem && (
        <div
          className="absolute bottom-0 left-1/2 w-[64%] -translate-x-1/2"
          style={{ top: `${silhouette.top + silhouette.height - 2}%` }}
          aria-hidden
        >
          <div className={`mx-auto h-[88%] bg-zinc-200/50 ${stem.rod}`} />
          <div
            className={`absolute bottom-0 left-1/2 h-[14%] -translate-x-1/2 rounded-[50%] bg-zinc-200/60 ${stem.base}`}
          />
        </div>
      )}

      {silhouette.handle && (
        <div
          aria-hidden
          className="absolute rounded-r-full border-y-2 border-r-2 border-zinc-200/60"
          style={{
            left: `${silhouette.left + silhouette.width - 6}%`,
            top: `${silhouette.top + silhouette.height * (largeHandle ? 0.22 : 0.18)}%`,
            height: `${silhouette.height * (largeHandle ? 0.48 : 0.42)}%`,
            width: largeHandle ? '24%' : '20%',
          }}
        />
      )}

      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={silhouette.d} />
          </clipPath>
        </defs>
      </svg>
      <div
        className="absolute overflow-hidden bg-sb-fill"
        style={{
          top: `${silhouette.top}%`,
          height: `${silhouette.height}%`,
          left: `${silhouette.left}%`,
          width: `${silhouette.width}%`,
          clipPath: `url(#${clipId})`,
        }}
      >
        <Fill color={color} bubbles={bubbles} foam={silhouette.foam} full={full} animated={animated} />
        {!silhouette.stem && (
          <div className="absolute inset-x-0 bottom-0 h-[11%] bg-zinc-200/40" aria-hidden />
        )}
      </div>
      <svg
        className="pointer-events-none absolute overflow-visible"
        aria-hidden
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        style={{
          top: `${silhouette.top}%`,
          height: `${silhouette.height}%`,
          left: `${silhouette.left}%`,
          width: `${silhouette.width}%`,
        }}
      >
        <path
          d={silhouette.d}
          fill="none"
          className="glass-outline"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
