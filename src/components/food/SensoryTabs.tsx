import { useRef, useState } from 'react'
import type { PerfilSensorial } from '../../types/beer'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Coffee, Eye, Waves, Wind } from 'lucide-react'

const TABS = [
  { key: 'apariencia', label: 'Apariencia', icon: Eye },
  { key: 'aroma', label: 'Aroma', icon: Wind },
  { key: 'sabor', label: 'Sabor', icon: Coffee },
  { key: 'sensacion_boca', label: 'En boca', icon: Waves },
] as const

type TabKey = (typeof TABS)[number]['key']

interface SensoryTabsProps {
  perfil: PerfilSensorial
}

/** Tabs compactos para condensar apariencia, aroma, sabor y sensación en boca. */
export function SensoryTabs({ perfil }: SensoryTabsProps) {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<TabKey>('apariencia')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeIndex = TABS.findIndex((t) => t.key === active)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = (activeIndex + dir + TABS.length) % TABS.length
    setActive(TABS[next].key)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Descripción sensorial"
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-1.5"
      >
        {TABS.map((tab, i) => {
          const isActive = tab.key === active
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={`sensory-tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`sensory-panel-${tab.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.key)}
              className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-bold whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none sm:text-sm ${
                isActive ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="sensory-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 380, damping: 32 }
                  }
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="relative mt-4 min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            role="tabpanel"
            id={`sensory-panel-${active}`}
            aria-labelledby={`sensory-tab-${active}`}
            initial={reduceMotion ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -14 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-pretty text-sm leading-relaxed text-slate-300">
              {perfil[active]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
