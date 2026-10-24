import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Search, WifiOff, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BeerCard } from '../components/BeerCard'
import { useBeers } from '../hooks/useBeers'

export function Home() {
  const reduceMotion = useReducedMotion()
  const { query, setQuery, categoria, setCategoria, toggleCategoria, results, categorias } =
    useBeers()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-20 sm:px-6">
      {/* Hero */}
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h1 className="text-4xl font-black tracking-tight text-transparent sm:text-5xl bg-linear-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text">
          SensiBrew
        </h1>
        <p className="text-balance-es mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Perfiles sensoriales, estadísticas vitales y maridajes gastronómicos de
          estilos cerveceros según la <strong className="font-semibold text-slate-100">guía BJCP 2021</strong>.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-500">
          <WifiOff className="h-3 w-3" />
          Funciona sin internet
        </p>

        {/* Acceso a la nueva ficha de detalle (modelo BeerStyle) */}
        <p className="mt-4">
          <Link
            to="/estilo/18B"
            className="group inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.3)] transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            Nueva ficha: American Pale Ale (18B)
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </p>
      </motion.header>

      {/* Buscador */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar estilo, categoría, descriptor o plato…"
            aria-label="Buscar estilo de cerveza"
            className="glass-panel w-full rounded-2xl py-3.5 pr-12 pl-11 text-sm text-slate-100 placeholder-slate-400 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100"
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

      {/* Resultados */}
      <p className="mt-8 mb-4 text-xs font-medium tracking-wide text-slate-400 uppercase">
        {results.length} {results.length === 1 ? 'estilo' : 'estilos'}
      </p>

      {results.length > 0 ? (
        <motion.div layout className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {results.map((beer, i) => (
              <BeerCard key={beer.id} beer={beer} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel rounded-2xl py-16 text-center"
        >
          <p className="text-4xl">🍻</p>
          <p className="mt-3 font-semibold text-slate-100">Sin resultados</p>
          <p className="mt-1 text-sm text-slate-400">
            Prueba con otro término, por ejemplo “citr”, “tostado” o “ceviche”.
          </p>
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
      className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
        active
          ? 'bg-amber-400 text-slate-900 shadow-[0_0_16px_rgba(251,191,36,0.3)]'
          : 'bg-slate-800 text-slate-300 ring-1 ring-slate-700 hover:bg-slate-700 hover:text-slate-100'
      }`}
    >
      {label}
    </button>
  )
}
