import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Beer, Search, WifiOff, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BeerCard } from '../components/BeerCard'
import { InstallBanner } from '../components/InstallBanner'
import { ORDENES, useBeers } from '../hooks/useBeers'

export function Home() {
  const reduceMotion = useReducedMotion()
  const {
    query,
    setQuery,
    categoria,
    setCategoria,
    toggleCategoria,
    orden,
    setOrden,
    results,
    categorias,
    limpiarFiltros,
    hayFiltros,
  } = useBeers()
  const inputRef = useRef<HTMLInputElement>(null)

  // Atajos de teclado: "/" enfoca el buscador, "Escape" lo limpia.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const escribiendo =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable

      if (e.key === '/' && !escribiendo) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && target === inputRef.current) {
        // Si ya está vacío, React hace bailout y no hay re-render
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
        <p className="text-balance-es mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sb-body sm:text-base">
          Perfiles sensoriales, estadísticas vitales y maridajes gastronómicos de
          estilos cerveceros según la <strong className="font-semibold text-sb-text">guía BJCP 2021</strong>.
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-sb-border bg-sb-fill px-3 py-1 text-[11px] font-medium text-sb-muted">
          <WifiOff className="h-3 w-3" aria-hidden />
          Funciona sin internet
        </p>

        {/* Acceso a la nueva ficha de detalle (modelo BeerStyle) */}
        <p className="mt-5">
          <Link
            to="/estilo/18B"
            className="group inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-sb-accent ring-1 ring-sb-focus/70 transition-all duration-200 hover:bg-amber-500/20 hover:ring-amber-500/50 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            Nueva ficha: American Pale Ale (18B)
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </p>
      </motion.header>

      {/* Invitación a instalar la PWA (se oculta si ya está instalada) */}
      <InstallBanner />

      {/* Buscador */}
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

        {/* Chips de categoría */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <CategoryChip label="Todas" active={!categoria} onClick={() => setCategoria(null)} />
          {categorias.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={categoria === cat}
              onClick={() => toggleCategoria(cat)}
            />
          ))}
        </div>
      </motion.div>

      {/* Resultados: contador + orden */}
      <div className="mt-10 mb-4 flex flex-wrap items-center justify-between gap-3">
        <p
          role="status"
          aria-live="polite"
          className="text-xs font-medium tracking-widest text-sb-muted uppercase"
        >
          {results.length} {results.length === 1 ? 'estilo' : 'estilos'}
        </p>

        <label className="flex items-center gap-2 text-xs font-medium text-sb-muted">
          Ordenar
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as typeof orden)}
            className="cursor-pointer rounded-full border border-sb-border bg-sb-fill px-3 py-1.5 text-xs font-semibold text-sb-body transition-colors hover:border-sb-border-strong hover:bg-sb-fill-strong focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            {ORDENES.map((o) => (
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
          {hayFiltros && (
            <button
              type="button"
              onClick={limpiarFiltros}
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
      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none ${
        active
          ? 'bg-amber-500 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.15)]'
          : 'text-sb-muted ring-1 ring-sb-border hover:bg-sb-fill hover:text-sb-text'
      }`}
    >
      {label}
    </button>
  )
}
