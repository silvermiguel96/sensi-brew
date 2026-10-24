import { useRef, useState } from 'react'
import type { PlatoSugerido } from '../../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, UtensilsCrossed } from 'lucide-react'
import { CATEGORIAS_MARIDAJE } from '../../lib/pairing'
import { SectionTitle } from '../SectionTitle'

interface DishCardProps {
  plato: PlatoSugerido
  index: number
}

/** Tarjeta de plato: "imagen" generada (gradiente + emoji), afinidad y principio. */
function DishCard({ plato, index }: DishCardProps) {
  const reduceMotion = useReducedMotion()
  const categoria = CATEGORIAS_MARIDAJE[plato.categoria]
  const Icono = categoria.icon

  return (
    <motion.article
      data-dish-card
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1], delay: index * 0.05 }}
      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="glass-panel group w-[250px] shrink-0 snap-start overflow-hidden rounded-2xl transition-colors hover:border-white/10 sm:w-[270px]"
    >
      {/* "Imagen" del plato */}
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden"
        style={{ background: categoria.gradient }}
        aria-hidden
      >
        <span className="text-6xl drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
          {plato.emoji}
        </span>

        {/* Brillo / reflejo */}
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-white/10" />

        {/* Categoría */}
        <span
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase backdrop-blur-sm ${categoria.chipClass}`}
        >
          <Icono className="h-3 w-3" />
          {categoria.label}
        </span>

        {/* Afinidad */}
        <div
          className="absolute right-2.5 bottom-2.5 flex items-end gap-1 rounded-full bg-zinc-950/60 px-2 py-1 backdrop-blur-sm"
          role="img"
          aria-label={`Afinidad ${plato.afinidad} de 5`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`w-1 rounded-full ${
                i < plato.afinidad ? 'bg-amber-400' : 'bg-white/25'
              }`}
              style={{ height: 6 + i * 2 }}
            />
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-sm leading-snug font-bold text-zinc-50">{plato.nombre}</h3>

        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200 transition-colors group-hover:bg-amber-500/15"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          {plato.principio}
        </motion.span>
      </div>
    </motion.article>
  )
}

interface SuggestedDishesProps {
  platos: PlatoSugerido[]
}

/** Carrusel horizontal de platos sugeridos con snap-scroll y controles. */
export function SuggestedDishes({ platos }: SuggestedDishesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const step = () => {
    const el = scrollerRef.current
    const card = el?.querySelector<HTMLElement>('[data-dish-card]')
    return card ? card.offsetWidth + 16 : 280
  }

  const move = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * step(), behavior: 'smooth' })
  }

  const goTo = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ left: index * step(), behavior: 'smooth' })
  }

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / step())
    setActive(Math.min(platos.length - 1, Math.max(0, index)))
  }

  return (
    <section aria-label="Platos sugeridos">
      <div className="mb-4 flex items-end justify-between gap-3">
        <SectionTitle
          icon={<UtensilsCrossed className="h-4 w-4" />}
          title="Platos sugeridos"
          hint="nivel de afinidad"
        />

        <div className="flex shrink-0 gap-1.5">
          <button
            onClick={() => move(-1)}
            aria-label="Platos anteriores"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:text-amber-300 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => move(1)}
            aria-label="Más platos"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:text-amber-300 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {platos.map((plato, i) => (
          <DishCard key={`${plato.nombre}-${i}`} plato={plato} index={i} />
        ))}
      </div>

      {/* Indicadores */}
      <div className="mt-3 flex justify-center gap-1.5">
        {platos.map((plato, i) => (
          <button
            key={plato.nombre}
            onClick={() => goTo(i)}
            aria-label={`Ir al plato ${i + 1}: ${plato.nombre}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all duration-300 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none ${
              i === active ? 'w-6 bg-amber-500' : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
