import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Beer, Search, WifiOff, X } from 'lucide-react'
import { BeerCard } from '../components/BeerCard'
import { InstallBanner } from '../components/InstallBanner'
import { catalogs } from '../data/beers'
import { SORT_ORDERS, useBeers } from '../hooks/useBeers'
import type { Guide } from '../types/beer'

/** Available guides, in the order the hero chips are shown. */
const GUIDES: Guide[] = ['2015', '2021']

export function Home({ guide, setGuide }: { guide: Guide; setGuide: (g: Guide) => void }) {
  const reduceMotion = useReducedMotion()
  const {
    query,
    setQuery,
    category,
    setCategory,
    toggleCategory,
    sortOrder,
    setSortOrder,
    results,
    categories,
    clearFilters,
    hasFilters,
  } = useBeers(guide)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcuts: "/" focuses the search box, "Escape" clears it.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable

      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && target === inputRef.current) {
        // If already empty, React bails out and skips the re-render
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setQuery])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-20 sm:px-6">
      {/* Hero */}
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="text-center"
      >
        <h1 className="text-gradient-gold font-serif text-5xl font-bold tracking-tight sm:text-6xl">
          SensiBrew
        </h1>
        <p className="text-balance mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sb-body sm:text-base">
          Perfiles sensoriales, estadísticas vitales y maridajes gastronómicos de
          estilos cerveceros según las guías <strong className="font-semibold text-sb-text">BJCP 2015 y 2021</strong>.
        </p>

        {/* Guide selector with style count (synced with the header) */}
        <div
          role="group"
          aria-label="Elegir guía BJCP"
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          {GUIDES.map((g) => {
            const active = guide === g
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGuide(g)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-6 py-3 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none ${active
                    ? 'bg-amber-500 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.2)]'
                    : 'text-sb-muted ring-1 ring-sb-border hover:bg-sb-fill hover:text-sb-text'
                  }`}
              >
                <span className="text-sm font-bold tracking-wide">📖 BJCP {g}</span>
                <span
                  className={`text-[11px] font-semibold tabular-nums ${active ? 'text-zinc-950/70' : 'text-sb-muted'
                    }`}
                >
                  {catalogs[g].length} estilos
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-sb-border bg-sb-fill px-3 py-1 text-[11px] font-medium text-sb-muted">
          <WifiOff className="h-3 w-3" aria-hidden />
          Funciona sin internet
        </p>
      </motion.header>

      {/* PWA install invitation (hidden once installed) */}
      <InstallBanner />

      {/* Search */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
        className="mt-10"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-sb-muted" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar estilo, categoría, descriptor o plato…"
            aria-label="Buscar estilo de cerveza"
            aria-keyshortcuts="/ Escape"
            className="glass-panel w-full rounded-2xl py-3.5 pr-12 pl-11 text-sm text-sb-text transition-shadow duration-200 placeholder:text-sb-muted focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-sb-muted transition-colors hover:bg-sb-fill hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <CategoryChip label="Todas" active={!category} onClick={() => setCategory(null)} />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={category === cat}
              onClick={() => toggleCategory(cat)}
            />
          ))}
        </div>
      </motion.div>

      {/* Results: counter + sort */}
      <div className="mt-10 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <p
            role="status"
            aria-live="polite"
            className="text-xs font-medium tracking-widest text-sb-muted uppercase"
          >
            {results.length} {results.length === 1 ? 'estilo' : 'estilos'}
          </p>
          <p aria-hidden className="text-xs font-medium tracking-widest text-zinc-600 uppercase">
            · {catalogs['2021'].length + catalogs['2015'].length} en total · 2 guías
            BJCP
          </p>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-sb-muted">
          Ordenar
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
            className="cursor-pointer rounded-full border border-sb-border bg-sb-fill px-3 py-1.5 text-xs font-semibold text-sb-body transition-colors hover:border-sb-border-strong hover:bg-sb-fill-strong focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            {SORT_ORDERS.map((o) => (
              <option key={o.value} value={o.value} className="bg-sb-bg text-sb-text">
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {results.length > 0 ? (
        <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((beer, i) => (
              <BeerCard key={beer.id} beer={beer} index={i} query={query} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl py-16 text-center"
        >
          <Beer className="mx-auto h-10 w-10 text-sb-accent/70" aria-hidden />
          <p className="mt-3 font-semibold text-sb-text">Sin resultados</p>
          <p className="mt-1 text-sm text-sb-muted">
            Prueba con otro término, por ejemplo “citr”, “tostado” o “ceviche”.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn-accent mt-5 px-4 py-2 text-sm"
            >
              <X className="h-4 w-4" aria-hidden />
              Limpiar búsqueda y filtros
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none ${active
          ? 'bg-amber-500 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.15)]'
          : 'text-sb-muted ring-1 ring-sb-border hover:bg-sb-fill hover:text-sb-text'
        }`}
    >
      {label}
    </button>
  )
}
