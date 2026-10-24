import type { BeerStyle } from '../../types/beerStyle'
import { motion, useReducedMotion } from 'framer-motion'
import { Flame, Thermometer, Wine } from 'lucide-react'
import { BeerGlass } from '../BeerGlass'
import { SectionTitle } from '../SectionTitle'
import { FlavorNotes } from './FlavorNotes'
import { PairingTabs } from './PairingTabs'
import { SensoryRadar } from './SensoryRadar'
import { SrmColorPill } from './SrmColorPill'
import { TechnicalStatCard } from './TechnicalStatCard'

interface BeerStyleDetailProps {
  style: BeerStyle
}

/** Página de detalle de un estilo con el nuevo modelo BeerStyle. */
export function BeerStyleDetail({ style }: BeerStyleDetailProps) {
  const reduceMotion = useReducedMotion()
  const { abv, ibu, temperaturaServicio } = style.rangosTecnicos

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pt-6 pb-20 sm:px-6">
      {/* ── Encabezado impactante ─────────────────────────────── */}
      <header className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(100% 100% at 50% 0%, ${style.colorSrm.hex}14, transparent 60%)`,
          }}
        />

        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            <BeerGlass hex={style.colorSrm.hex} className="h-56 w-36" />
          </motion.div>

          <div className="min-w-0">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold tracking-widest text-amber-400 uppercase"
            >
              Estilo {style.id} · BJCP {style.guiaBjcp}
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
              className="mt-3 font-serif text-4xl font-normal tracking-normal text-zinc-50 sm:text-5xl"
            >
              {style.nombre}
            </motion.h1>

            <p className="mt-1.5 text-sm font-medium text-zinc-400">{style.categoria}</p>

            <div className="mt-5 flex justify-center sm:justify-start">
              <SrmColorPill
                hex={style.colorSrm.hex}
                min={style.colorSrm.min}
                max={style.colorSrm.max}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Métrica técnica ───────────────────────────────────── */}
      <section className="mt-10">
        <SectionTitle title="Métrica técnica" hint="rango BJCP vs. escala estándar" />
        <div className="glass-panel grid divide-y divide-white/5 rounded-2xl sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <TechnicalStatCard icon={<Wine className="h-4.5 w-4.5" />} spec={abv} delay={0} />
          <TechnicalStatCard icon={<Flame className="h-4.5 w-4.5" />} spec={ibu} delay={0.05} />
          <TechnicalStatCard
            icon={<Thermometer className="h-4.5 w-4.5" />}
            spec={temperaturaServicio}
            delay={0.1}
          />
        </div>
      </section>

      {/* ── Perfil sensorial ──────────────────────────────────── */}
      <section className="glass-panel mt-10 grid divide-y divide-white/5 rounded-2xl lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="p-5 sm:p-6">
          <SectionTitle title="Perfil sensorial" hint="intensidad 1–5" />
          <SensoryRadar perfil={style.perfilSensorial} hex={style.colorSrm.hex} />
          <p className="mt-2 text-center text-[11px] font-medium text-zinc-400">
            1 = muy suave · 5 = muy intenso
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <SectionTitle title="Notas de sabor" />
          <FlavorNotes notas={style.notasSabor} />
          <p className="mt-6 border-t border-white/5 pt-4 text-xs leading-relaxed text-zinc-400">
            {style.resumenNotas}
          </p>
        </div>
      </section>

      {/* ── Maridaje recomendado ──────────────────────────────── */}
      <section className="mt-10">
        <SectionTitle title="Maridaje recomendado" hint="por categoría" />
        <PairingTabs maridajes={style.maridajes} />
      </section>
    </article>
  )
}
