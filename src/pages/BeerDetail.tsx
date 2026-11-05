import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Beer, Gauge } from 'lucide-react'
import { catalogs, getBeerById } from '../data/beers'
import { srmMid, srmToColor } from '../lib/srm'
import { DetailBar } from '../components/DetailBar'
import { BeerGlass } from '../components/BeerGlass'
import { PairingCard } from '../components/PairingCard'
import { SensoryRadar } from '../components/SensoryRadar'
import { SectionTitle } from '../components/SectionTitle'
import { VitalStats } from '../components/VitalStats'
import { SrmColorPill } from '../components/SrmColorPill'
import { SensoryTabs } from '../components/SensoryTabs'
import { SuggestedDishes } from '../components/SuggestedDishes'
import { usePageMeta } from '../hooks/usePageMeta'
import type { Guide } from '../types/beer'

interface BeerDetailProps {
  guide: Guide
  setGuide: (guide: Guide) => void
}

export function BeerDetail({ guide, setGuide }: BeerDetailProps) {
  const { id } = useParams<{ id: string }>()
  const reduceMotion = useReducedMotion()
  const beer = id ? getBeerById(guide, id) : undefined
  const otherGuide: Guide = guide === '2021' ? '2015' : '2021'
  const beerInOtherGuide = id ? getBeerById(otherGuide, id) : undefined

  usePageMeta(
    beer ? `${beer.name} (${beer.id}) — SensiBrew BJCP ${beer.guide}` : null,
    beer
      ? `Perfil sensorial, IBU, SRM, ABV y maridajes para el estilo ${beer.name} (${beer.id}) según la guía oficial BJCP ${beer.guide}.`
      : null,
  )

  if (!beer) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <Beer className="mx-auto h-10 w-10 text-sb-accent/70" aria-hidden />
        <h1 className="mt-4 text-xl font-bold text-sb-text">Estilo no encontrado</h1>
        {beerInOtherGuide ? (
          <>
            <p className="mt-2 text-sm text-sb-muted">
              El estilo “{id}” no existe en la guía BJCP {guide}, pero está disponible en la guía BJCP {otherGuide} ({beerInOtherGuide.name}).
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setGuide(otherGuide)}
                className="btn-accent px-4 py-2.5 text-sm"
              >
                Ver estilo en guía BJCP {otherGuide}
              </button>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-sb-border px-4 py-2.5 text-sm font-semibold text-sb-body transition-colors hover:bg-sb-fill hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Volver al catálogo
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-sb-muted">
              El estilo “{id}” no existe en el catálogo local.
            </p>
            <Link
              to="/"
              className="btn-accent mt-6 px-4 py-2.5 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Volver al catálogo
            </Link>
          </>
        )}
      </div>
    )
  }

  const srm = beer.vitalStats.srm
  const color = srmToColor(srmMid(srm))
  const catalog = catalogs[guide]
  const idx = catalog.findIndex((b) => b.id === beer.id)
  const prev = catalog[(idx - 1 + catalog.length) % catalog.length]
  const next = catalog[(idx + 1) % catalog.length]

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={beer.id}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-6"
      >
        <DetailBar title={`${beer.name} (${beer.id}) — SensiBrew`} />

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="glass-panel relative mt-4 overflow-hidden rounded-2xl p-5 sm:p-8">
          <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-12 sm:text-left">
            <motion.div
              className="flex shrink-0 flex-col items-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
              <BeerGlass
                srm={srmMid(srm)}
                type={beer.glass.type}
                className="h-44 w-28 sm:h-72 sm:w-44 lg:h-80 lg:w-52"
              />
              {beerInOtherGuide && (
                <button
                  type="button"
                  onClick={() => setGuide(otherGuide)}
                  aria-label={`Ver este estilo en la guía BJCP ${otherGuide}`}
                  className="cursor-pointer rounded-full border border-sb-border px-3 py-1.5 text-[11px] font-semibold text-sb-accent transition-colors hover:bg-sb-fill hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
                >
                  También en BJCP {otherGuide} ↗
                </button>
              )}
            </motion.div>

            <div className="min-w-0 flex-1">
              <span className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-bold tracking-widest text-sb-accent uppercase">
                Estilo {beer.id} · BJCP {beer.guide}
              </span>
              <h1 className="mt-2.5 font-serif text-3xl font-medium tracking-normal text-sb-title sm:text-4xl">
                {beer.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-sb-muted">{beer.category}</p>

              <div className="mt-4 flex justify-center sm:justify-start">
                {srm ? (
                  <SrmColorPill hex={color} min={srm[0]} max={srm[1]} />
                ) : (
                  <p className="text-sm font-medium text-sb-muted">Color variable</p>
                )}
              </div>

              <div className="mt-4 max-w-md">
                <p className="text-[11px] font-bold tracking-widest text-sb-accent uppercase">
                  Vaso
                </p>
                <p className="mt-1 text-sm font-semibold text-sb-text">
                  {beer.glass.type}
                  <span className="font-medium text-sb-muted">
                    {' '}
                    · {beer.glass.capacityMl} ml
                  </span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-sb-muted">
                  {beer.glass.reason}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── 1. Pairing: suggested dishes (featured) ──────────── */}
        <div className="mt-10">
          <SuggestedDishes dishes={beer.suggestedDishes} />
        </div>

        {/* ── 2. Star pairing ───────────────────────────────────── */}
        <div className="mt-10">
          {beer.pairings.map((pairing) => (
            <PairingCard
              key={pairing.dish}
              pairing={pairing}
              title="El maridaje estrella"
            />
          ))}
        </div>

        {/* ── 3. Condensed sensory + sidebar ───────────────────── */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_340px]">
          <section className="glass-panel rounded-2xl p-5 sm:p-6">
            <SectionTitle title="Perfil sensorial" hint="toca para explorar" />
            <SensoryTabs profile={beer.sensoryProfile} />

            <div className="mt-5 flex flex-wrap gap-1.5 border-t border-sb-border pt-4">
              {beer.sensoryProfile.descriptors.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-sb-fill px-2.5 py-1 text-[11px] font-medium text-sb-muted"
                >
                  {d}
                </span>
              ))}
            </div>
          </section>

          <aside className="glass-panel h-fit divide-y divide-sb-border rounded-2xl">
            <div className="p-5">
              <SectionTitle title="Intensidad" hint="escala 0–5" />
              <SensoryRadar intensity={beer.sensoryProfile.intensity} height={210} />
            </div>

            <div className="p-5">
              <SectionTitle icon={<Gauge className="h-4 w-4" />} title="Estadísticas" />
              <div className="mt-4">
                <VitalStats stats={beer.vitalStats} />
              </div>
            </div>
          </aside>
        </div>

        {/* ── Navigation between styles ─────────────────────────── */}
        <nav className="mt-10 flex items-stretch justify-between gap-3">
          <Link
            to={`/estilo/${prev.id}`}
            className="glass-panel glow-hover group flex flex-1 items-center gap-3 rounded-2xl p-4 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-sb-muted transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[11px] text-sb-muted">Anterior</span>
              <span className="block truncate text-sm font-semibold text-sb-text group-hover:text-sb-accent">
                {prev.id} · {prev.name}
              </span>
            </span>
          </Link>
          <Link
            to={`/estilo/${next.id}`}
            className="glass-panel glow-hover group flex flex-1 items-center justify-end gap-3 rounded-2xl p-4 text-right focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            <span className="min-w-0">
              <span className="block text-[11px] text-sb-muted">Siguiente</span>
              <span className="block truncate text-sm font-semibold text-sb-text group-hover:text-sb-accent">
                {next.id} · {next.name}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-sb-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </nav>
      </motion.article>
    </AnimatePresence>
  )
}
