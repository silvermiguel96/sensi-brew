import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Gauge } from 'lucide-react'
import { beers, getBeerById } from '../data/beers'
import { srmRangeToColor, srmToColor } from '../lib/srm'
import { BeerGlass } from '../components/BeerGlass'
import { MaridajeCard } from '../components/MaridajeCard'
import { RadarPerfil } from '../components/RadarPerfil'
import { SectionTitle } from '../components/SectionTitle'
import { VitalesBar } from '../components/VitalesBar'
import { SrmColorPill } from '../components/beerstyle/SrmColorPill'
import { SensoryTabs } from '../components/food/SensoryTabs'
import { SuggestedDishes } from '../components/food/SuggestedDishes'

export function BeerDetail() {
  const { id } = useParams<{ id: string }>()
  const reduceMotion = useReducedMotion()
  const beer = id ? getBeerById(id) : undefined

  if (!beer) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-4xl">🍺</p>
        <h1 className="mt-4 text-xl font-bold text-slate-100">Estilo no encontrado</h1>
        <p className="mt-2 text-sm text-slate-400">
          El estilo “{id}” no existe en el catálogo local.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-transform hover:scale-[1.03]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>
      </div>
    )
  }

  const srm = beer.estadisticas_vitales.srm
  const color = srm ? srmRangeToColor(srm) : srmToColor(10)
  const idx = beers.findIndex((b) => b.id === beer.id)
  const prev = beers[(idx - 1 + beers.length) % beers.length]
  const next = beers[(idx + 1) % beers.length]

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={beer.id}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-5xl px-4 pt-6 pb-20 sm:px-6"
      >
        {/* Volver */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" /> Catálogo
        </Link>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="relative mt-4 overflow-hidden rounded-3xl border border-slate-800 p-5 sm:p-8">
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-12 sm:text-left">
            <motion.div
              className="shrink-0"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <BeerGlass
                srm={srm ? (srm[0] + srm[1]) / 2 : 10}
                tipo={beer.tipo_vaso.tipo}
                className="h-44 w-28 sm:h-72 sm:w-44 lg:h-80 lg:w-52"
              />
            </motion.div>

            <div className="min-w-0 flex-1">
              <span className="rounded-md bg-amber-400/15 px-2 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-400/30">
                Estilo {beer.id} · BJCP {beer.guia_bjcp}
              </span>
              <h1 className="mt-2.5 text-2xl font-black tracking-tight text-slate-50 sm:text-3xl">
                {beer.nombre_estilo}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-400">{beer.categoria}</p>

              <div className="mt-4 flex justify-center sm:justify-start">
                {srm ? (
                  <SrmColorPill hex={color} min={srm[0]} max={srm[1]} />
                ) : (
                  <p className="text-sm font-medium text-slate-400">Color variable</p>
                )}
              </div>

              <div className="mt-4 max-w-md">
                <p className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                  Vaso
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  {beer.tipo_vaso.tipo}
                  <span className="font-medium text-slate-400">
                    {' '}
                    · {beer.tipo_vaso.capacidad_ml} ml
                  </span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {beer.tipo_vaso.justificacion}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── 1. Maridaje: platos sugeridos (destacado) ─────────── */}
        <div className="mt-8">
          <SuggestedDishes platos={beer.platos_sugeridos} />
        </div>

        {/* ── 2. Maridaje estrella ──────────────────────────────── */}
        <div className="mt-8">
          {beer.maridaje_gastronomico.map((maridaje) => (
            <MaridajeCard
              key={maridaje.plato}
              maridaje={maridaje}
              title="El maridaje estrella"
            />
          ))}
        </div>

        {/* ── 3. Sensorial condensado + sidebar ────────────────── */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_340px]">
          <section className="glass-panel rounded-2xl p-5 sm:p-6">
            <SectionTitle title="Perfil sensorial" hint="toca para explorar" />
            <SensoryTabs perfil={beer.perfil_sensorial} />

            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-700/60 pt-4">
              {beer.perfil_sensorial.burbujas_descriptores.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-slate-700"
                >
                  {d}
                </span>
              ))}
            </div>
          </section>

          <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="glass-panel rounded-2xl p-5">
              <SectionTitle title="Intensidad" hint="escala 0–5" />
              <RadarPerfil perfil={beer.perfil_sensorial.radar_intensidad} height={210} />
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <SectionTitle icon={<Gauge className="h-4 w-4" />} title="Estadísticas" />
              <div className="mt-4">
                <VitalesBar estadisticas={beer.estadisticas_vitales} />
              </div>
            </div>
          </aside>
        </div>

        {/* ── Navegación entre estilos ──────────────────────────── */}
        <nav className="mt-10 flex items-stretch justify-between gap-3">
          <Link
            to={`/estilo/${prev.id}`}
            className="glass-panel group flex flex-1 items-center gap-3 rounded-2xl p-4 transition-colors hover:border-amber-400/40"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-x-0.5" />
            <span className="min-w-0">
              <span className="block text-[11px] text-slate-400">Anterior</span>
              <span className="block truncate text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                {prev.id} · {prev.nombre_estilo}
              </span>
            </span>
          </Link>
          <Link
            to={`/estilo/${next.id}`}
            className="glass-panel group flex flex-1 items-center justify-end gap-3 rounded-2xl p-4 text-right transition-colors hover:border-amber-400/40"
          >
            <span className="min-w-0">
              <span className="block text-[11px] text-slate-400">Siguiente</span>
              <span className="block truncate text-sm font-semibold text-slate-100 group-hover:text-amber-300">
                {next.id} · {next.nombre_estilo}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </nav>
      </motion.article>
    </AnimatePresence>
  )
}
