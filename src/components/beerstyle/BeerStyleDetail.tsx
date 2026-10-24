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
    <article className="mx-auto w-full max-w-5xl px-4 pt-6 pb-20 sm:px-6">
      {/* ── Encabezado impactante ─────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(90% 130% at 88% 0%, ${style.colorSrm.hex}2e, transparent 58%)`,
          }}
        />

        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <BeerGlass hex={style.colorSrm.hex} className="h-56 w-36" />
          </motion.div>

          <div className="min-w-0">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-block rounded-md border border-amber-500/30 bg-amber-500/12 px-2.5 py-1 text-xs font-bold tracking-wide text-amber-400"
            >
              Estilo {style.id} · BJCP {style.guiaBjcp}
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl"
            >
              {style.nombre}
            </motion.h1>

            <p className="mt-1.5 text-sm font-medium text-slate-400">{style.categoria}</p>

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
      <section className="mt-8">
        <SectionTitle title="Métrica técnica" hint="rango BJCP vs. escala estándar" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TechnicalStatCard
            icon={<Wine className="h-4.5 w-4.5" />}
            accentClass="text-amber-400"
            spec={abv}
            delay={0}
          />
          <TechnicalStatCard
            icon={<Flame className="h-4.5 w-4.5" />}
            accentClass="text-orange-400"
            spec={ibu}
            delay={0.1}
          />
          <TechnicalStatCard
            icon={<Thermometer className="h-4.5 w-4.5" />}
            accentClass="text-yellow-500"
            spec={temperaturaServicio}
            delay={0.2}
          />
        </div>
      </section>

      {/* ── Perfil sensorial ──────────────────────────────────── */}
      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 sm:p-6">
          <SectionTitle title="Perfil sensorial" hint="intensidad 1–5" />
          <SensoryRadar perfil={style.perfilSensorial} hex={style.colorSrm.hex} />
          <p className="mt-2 text-center text-[11px] font-medium text-slate-500">
            1 = muy suave · 5 = muy intenso
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 sm:p-6">
          <SectionTitle title="Notas de sabor" />
          <FlavorNotes notas={style.notasSabor} />
          <p className="mt-6 border-t border-slate-800 pt-4 text-xs leading-relaxed text-slate-400">
            {style.resumenNotas}
          </p>
        </div>
      </section>

      {/* ── Maridaje recomendado ──────────────────────────────── */}
      <section className="mt-8">
        <SectionTitle title="Maridaje recomendado" hint="por categoría" />
        <PairingTabs maridajes={style.maridajes} />
      </section>
    </article>
  )
}
