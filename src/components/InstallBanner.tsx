import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpFromLine,
  Check,
  Download,
  Plus,
  Share,
  WifiOff,
  Zap,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

/**
 * Pasos para instalar en iPhone/iPad (Safari no dispara el prompt nativo,
 * así que hay que guiar: Compartir → Añadir a pantalla de inicio).
 */
function GuiaIOS({ compacta = false }: { compacta?: boolean }) {
  const pasos = [
    { icono: Share, texto: 'Toca el botón Compartir (cuadrado con flecha ↑) de Safari.' },
    { icono: ArrowUpFromLine, texto: 'Desliza y elige “Añadir a pantalla de inicio”.' },
    { icono: Plus, texto: 'Pulsa “Añadir” arriba a la derecha. ¡Listo!' },
  ]

  return (
    <ol className={`flex flex-col gap-2 ${compacta ? 'text-xs' : 'text-sm'}`}>
      {pasos.map(({ icono: Icono, texto }, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sb-body">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/15 text-[11px] font-bold text-sb-accent">
            {i + 1}
          </span>
          <Icono className="mt-0.5 h-4 w-4 shrink-0 text-sb-accent" aria-hidden />
          <span className="leading-snug">{texto}</span>
        </li>
      ))}
    </ol>
  )
}

/** Guía de iOS que se abre y se cierra. El contenedor lo pone quien la usa. */
export function GuiaDesplegable({
  abierta,
  compacta = false,
  className,
}: {
  abierta: boolean
  compacta?: boolean
  className: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {abierta && (
        <motion.div
          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="overflow-hidden"
        >
          <div className={className}>
            <GuiaIOS compacta={compacta} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Banner del Home que invita a instalar la PWA.
 * Muestra el botón nativo (Chrome/Edge) o la guía para iPhone (Safari).
 * Se oculta si ya está instalada o si el usuario pospuso la invitación.
 */
export function InstallBanner() {
  const reduceMotion = useReducedMotion()
  const { disponible, puedeInstalar, esIOS, instalar, posponer } = useInstallPrompt()
  const [guiaAbierta, setGuiaAbierta] = useState(false)

  if (!disponible) return null

  const accion: {
    etiqueta: string
    onClick: () => void
    expanded?: boolean
    icono?: LucideIcon
  } | null = esIOS
    ? {
        etiqueta: 'Cómo instalar en iPhone',
        onClick: () => setGuiaAbierta((v) => !v),
        expanded: guiaAbierta,
      }
    : puedeInstalar
      ? { etiqueta: 'Instalar app', onClick: () => void instalar(), icono: Download }
      : null

  return (
    <motion.section
      aria-label="Instalar SensiBrew"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
      className="glass-panel relative mt-8 overflow-hidden rounded-2xl p-5 sm:p-6"
    >
      {/* Brillo ámbar sutil en la esquina */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_70%)]"
      />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-500 ring-1 ring-sb-focus/40">
            <Download className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-serif text-lg font-semibold text-sb-title">
              Instala SensiBrew
            </h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-sb-body">
              Se abre desde tu pantalla de inicio, arranca al instante y funciona
              sin internet. Como si fuera una app de verdad —porque lo es.
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-sb-muted">
              <li className="inline-flex items-center gap-1">
                <WifiOff className="h-3 w-3 text-sb-accent" aria-hidden /> 100% offline
              </li>
              <li className="inline-flex items-center gap-1">
                <Zap className="h-3 w-3 text-sb-accent" aria-hidden /> Arranque instantáneo
              </li>
              <li className="inline-flex items-center gap-1">
                <Check className="h-3 w-3 text-sb-accent" aria-hidden /> Sin instalar nada extra
              </li>
            </ul>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
          {accion && (
            <button
              type="button"
              onClick={accion.onClick}
              aria-expanded={accion.expanded}
              className="btn-accent px-5 py-2.5 text-sm"
            >
              {accion.icono && <accion.icono className="h-4 w-4" aria-hidden />}
              {accion.etiqueta}
            </button>
          )}
          <button
            type="button"
            onClick={posponer}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-sb-muted transition-colors hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
            Ahora no
          </button>
        </div>
      </div>

      <GuiaDesplegable
        abierta={guiaAbierta && esIOS}
        className="mt-4 rounded-xl border border-sb-border bg-sb-fill p-4"
      />
    </motion.section>
  )
}
