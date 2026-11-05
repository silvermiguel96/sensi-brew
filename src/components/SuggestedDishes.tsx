import { useCallback, useEffect, useRef, useState } from 'react'
import type { SuggestedDish } from '../types/beer'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, UtensilsCrossed } from 'lucide-react'
import { DISH_CATEGORIES } from '../lib/pairing'
import { SectionTitle } from './SectionTitle'

interface DishCardProps {
  dish: SuggestedDish
  index: number
}

/** Dish card: generated "image" (gradient + emoji), affinity and principle. */
function DishCard({ dish, index }: DishCardProps) {
  const reduceMotion = useReducedMotion()
  const category = DISH_CATEGORIES[dish.category]
  const Icon = category.icon

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
      {/* Dish "image" */}
      <div
        className="relative flex h-36 items-center justify-center overflow-hidden"
        style={{ background: category.gradient }}
        aria-hidden
      >
        <span className="text-6xl drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
          {dish.emoji}
        </span>

        {/* Shine / reflection */}
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950/60 via-transparent to-white/10" />

        {/* Category */}
        <span
          className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${category.chipClass}`}
        >
          <Icon className="h-3 w-3" />
          {category.label}
        </span>

        {/* Affinity */}
        <div
          className="absolute right-2.5 bottom-2.5 flex items-end gap-1 rounded-full bg-zinc-950/80 px-2 py-1"
          role="img"
          aria-label={`Afinidad ${dish.affinity} de 5`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`w-1 shrink-0 rounded-full ${
                i < dish.affinity ? 'bg-amber-400' : 'bg-white/25'
              }`}
              style={{ height: 6 + i * 2 }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm leading-snug font-bold text-sb-title">{dish.name}</h3>

        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 + index * 0.05 }}
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-sb-accent transition-colors group-hover:bg-amber-500/15"
        >
          <Sparkles className="h-3 w-3 text-sb-accent" />
          {dish.principle}
        </motion.span>
      </div>
    </motion.article>
  )
}

interface SuggestedDishesProps {
  dishes: SuggestedDish[]
}

type CarouselMetrics = {
  step: number
  pageCount: number
  maxScroll: number
}

/** Horizontal carousel of suggested dishes with snap scrolling and controls. */
export function SuggestedDishes({ dishes }: SuggestedDishesProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<CarouselMetrics>({ step: 280, pageCount: 1, maxScroll: 0 })
  const reduceMotion = useReducedMotion()
  const [pageCount, setPageCount] = useState(1)
  const [activePage, setActivePage] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const applyScroll = useCallback((scrollLeft: number) => {
    const { pageCount: pages, maxScroll } = metricsRef.current
    const nextLeft = scrollLeft > 2
    const nextRight = maxScroll > 2 && scrollLeft < maxScroll - 2
    let nextPage = 0
    if (maxScroll > 2) {
      nextPage =
        scrollLeft >= maxScroll - 5
          ? pages - 1
          : Math.min(pages - 1, Math.max(0, Math.round((scrollLeft / maxScroll) * (pages - 1))))
    }
    setCanScrollLeft((prev) => (prev === nextLeft ? prev : nextLeft))
    setCanScrollRight((prev) => (prev === nextRight ? prev : nextRight))
    setActivePage((prev) => (prev === nextPage ? prev : nextPage))
  }, [])

  // Measure geometry only on resize; scrolling never re-reads the layout.
  const measure = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-dish-card]')
    const cardWidth = card ? card.offsetWidth + 16 : 280
    const visibleCount = Math.max(1, Math.floor((el.clientWidth + 16) / cardWidth))
    const pages = Math.max(1, Math.ceil(dishes.length / visibleCount))
    metricsRef.current = {
      step: visibleCount > 1 ? visibleCount * cardWidth : cardWidth,
      pageCount: pages,
      maxScroll: Math.max(0, el.scrollWidth - el.clientWidth),
    }
    setPageCount((prev) => (prev === pages ? prev : pages))
    applyScroll(el.scrollLeft)
  }, [dishes.length, applyScroll])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  const move = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({
      left: dir * metricsRef.current.step,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  const goToPage = (pageIndex: number) => {
    const el = scrollerRef.current
    if (!el) return
    const { pageCount: pages, maxScroll } = metricsRef.current
    if (pages <= 1 || maxScroll <= 0) return
    el.scrollTo({
      left: (pageIndex / (pages - 1)) * maxScroll,
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  const handleScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    applyScroll(el.scrollLeft)
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
        {dishes.map((dish, i) => (
          <DishCard key={`${dish.name}-${i}`} dish={dish} index={i} />
        ))}
      </div>

      {/* Page indicators: adapt to how many cards fit on screen */}
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
