import { useRef, useState } from 'react'
import type { FoodPairing, PairingCategory } from '../../types/beerStyle'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Beef, CakeSlice, Milk } from 'lucide-react'
import { PairingCard } from './PairingCard'

const CATEGORY_ICONS: Record<PairingCategory, React.ReactNode> = {
  carnes: <Beef className="h-5 w-5" />,
  quesos: <Milk className="h-5 w-5" />,
  postres: <CakeSlice className="h-5 w-5" />,
}

const CATEGORY_LABELS: Record<PairingCategory, string> = {
  carnes: 'Carnes',
  quesos: 'Quesos',
  postres: 'Postres',
}

interface PairingTabsProps {
  maridajes: FoodPairing[]
}

/** Tabs accesibles de maridaje con indicador deslizante animado. */
export function PairingTabs({ maridajes }: PairingTabsProps) {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const seleccionado = maridajes[active]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (active + dir + maridajes.length) % maridajes.length
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      {/* Tablist */}
      <div
        role="tablist"
        aria-label="Categorías de maridaje"
        onKeyDown={handleKeyDown}
        className="inline-flex flex-wrap gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5"
      >
        {maridajes.map((m, i) => {
          const isActive = i === active
          return (
            <button
              key={m.categoria}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={`tab-${m.categoria}`}
              aria-selected={isActive}
              aria-controls={`panel-${m.categoria}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                isActive ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="pairing-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 shadow-[0_0_18px_rgba(245,158,11,0.35)]"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 380, damping: 32 }
                  }
                />
              )}
              <span className="relative flex items-center gap-2">
                {CATEGORY_ICONS[m.categoria]}
                {CATEGORY_LABELS[m.categoria]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Panel activo */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={seleccionado.categoria}
            role="tabpanel"
            id={`panel-${seleccionado.categoria}`}
            aria-labelledby={`tab-${seleccionado.categoria}`}
            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <PairingCard
              pairing={seleccionado}
              icon={CATEGORY_ICONS[seleccionado.categoria]}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
