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
    <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-20 sm:px-6">
      {/* Hero */}
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="text-center"
      >
        <h1 className="text-4xl font-black tracking-tight text-zinc-50 sm:text-5xl">
          SensiBrew
        </h1>
        <p className="text-balance-es mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          Perfiles sensoriales, estadísticas vitales y maridajes gastronómicos de
          estilos cerveceros según la <strong className="font-semibold text-zinc-100">guía BJCP 2021</strong>.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-zinc-400">
          <WifiOff className="h-3 w-3" />
          Funciona sin internet
        </p>

        {/* Acceso a la nueva ficha de detalle (modelo BeerStyle) */}
        <p className="mt-4">
          <Link
            to="/estilo/18B"
            className="group inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.08)] transition-colors hover:bg-amber-400 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none"
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
        transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
        className="mt-10"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar estilo, categoría, descriptor o plato…"
            aria-label="Buscar estilo de cerveza"
            className="glass-panel w-full rounded-2xl py-3.5 pr-12 pl-11 text-sm text-zinc-100 placeholder-zinc-500 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
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
      <p className="mt-10 mb-4 text-xs font-medium tracking-widest text-zinc-400 uppercase">
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
          <p className="mt-3 font-semibold text-zinc-100">Sin resultados</p>
          <p className="mt-1 text-sm text-zinc-400">
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
      className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none ${
        active
          ? 'bg-amber-500 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.08)]'
          : 'text-zinc-400 ring-1 ring-white/10 hover:bg-white/5 hover:text-zinc-100'
      }`}
    >
      {label}
    </button>
  )
}
