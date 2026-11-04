import { useCallback, useEffect, useRef, useState } from 'react'
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
      className="glass-panel group w-[250px] shrink-0 snap-start overflow-hidden rounded-2xl transition-colors hover:border-sb-border sm:w-[270px]"
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
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${categoria.chipClass}`}
        >
          <Icono className="h-3 w-3" />
          {categoria.label}
        </span>

        {/* Afinidad */}
        <div
          className="absolute right-2.5 bottom-2.5 flex items-end gap-1 rounded-full bg-zinc-950/80 px-2 py-1"
          role="img"
          aria-label={`Afinidad ${plato.afinidad} de 5`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`w-1 shrink-0 rounded-full ${
                i < plato.afinidad ? 'bg-amber-400' : 'bg-white/25'
              }`}
              style={{ height: 6 + i * 2 }}
            />
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-sm leading-snug font-bold text-sb-title">{plato.nombre}</h3>

        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-sb-accent transition-colors group-hover:bg-amber-500/15"
        >
          <Sparkles className="h-3 w-3 text-sb-accent" />
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
  const reduceMotion = useReducedMotion()
  const [pageCount, setPageCount] = useState(1)
  const [activePage, setActivePage] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateMetrics = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return

    const card = el.querySelector<HTMLElement>('[data-dish-card]')
    const cardWidth = card ? card.offsetWidth + 16 : 280
    const visibleCount = Math.max(1, Math.floor((el.clientWidth + 16) / cardWidth))
    const totalPages = Math.max(1, Math.ceil(platos.length / visibleCount))
    setPageCount(totalPages)

    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2)

    if (maxScroll <= 2) {
      setActivePage(0)
    } else if (el.scrollLeft >= maxScroll - 5) {
      setActivePage(totalPages - 1)
    } else {
      const progress = el.scrollLeft / maxScroll
      setActivePage(Math.min(totalPages - 1, Math.max(0, Math.round(progress * (totalPages - 1)))))
    }
  }, [platos.length])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    updateMetrics()

    const ro = new ResizeObserver(() => {
      updateMetrics()
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [updateMetrics])

  const move = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-dish-card]')
    const cardWidth = card ? card.offsetWidth + 16 : 280
    const visibleCount = Math.max(1, Math.floor((el.clientWidth + 16) / cardWidth))
    const amount = visibleCount > 1 ? visibleCount * cardWidth : cardWidth
    el.scrollBy({
      left: dir * amount,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  const goToPage = (pageIndex: number) => {
    const el = scrollerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (pageCount <= 1 || maxScroll <= 0) return
    const targetScroll = (pageIndex / (pageCount - 1)) * maxScroll
    el.scrollTo({
      left: targetScroll,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  const handleScroll = () => {
    updateMetrics()
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
            type="button"
            onClick={() => move(-1)}
            aria-label="Platos anteriores"
            disabled={!canScrollLeft}
            className="grid h-11 w-11 place-items-center rounded-full border border-sb-border bg-sb-fill text-sb-body transition-colors hover:text-sb-accent focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-sb-body"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Más platos"
            disabled={!canScrollRight}
            className="grid h-11 w-11 place-items-center rounded-full border border-sb-border bg-sb-fill text-sb-body transition-colors hover:text-sb-accent focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-sb-body"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 scroll-pl-4 [scrollbar-width:none] sm:mx-0 sm:px-0 sm:scroll-pl-0 [&::-webkit-scrollbar]:hidden"
      >
        {platos.map((plato, i) => (
          <DishCard key={`${plato.nombre}-${i}`} plato={plato} index={i} />
        ))}
      </div>

      {/* Indicadores de página / navegación: adaptados dinámicamente según cuántas tarjetas caben */}
      {pageCount > 1 && (
        <div
          role="tablist"
          aria-label="Páginas de platos sugeridos"
          className="mt-1 flex items-center justify-center"
        >
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activePage}
              onClick={() => goToPage(i)}
              aria-label={`Ir a la página ${i + 1} de ${pageCount}`}
              className="grid h-11 place-items-center px-1.5 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activePage ? 'w-6 bg-amber-500' : 'w-1.5 bg-sb-muted/50'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
