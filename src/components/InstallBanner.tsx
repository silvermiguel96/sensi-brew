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
 * Install steps for iPhone/iPad (Safari does not fire the native prompt,
 * so the user is guided: Share → Add to Home Screen).
 */
function IosSteps({ compact = false }: { compact?: boolean }) {
  const steps = [
    { icon: Share, text: 'Toca el botón Compartir (cuadrado con flecha ↑) de Safari.' },
    { icon: ArrowUpFromLine, text: 'Desliza y elige “Añadir a pantalla de inicio”.' },
    { icon: Plus, text: 'Pulsa “Añadir” arriba a la derecha. ¡Listo!' },
  ]

  return (
    <ol className={`flex flex-col gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
      {steps.map(({ icon: Icon, text }, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sb-body">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-500/15 text-[11px] font-bold text-sb-accent">
            {i + 1}
          </span>
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-sb-accent" aria-hidden />
          <span className="leading-snug">{text}</span>
        </li>
      ))}
    </ol>
  )
}

/** Collapsible iOS guide. The caller provides the container styles. */
export function IosInstallGuide({
  open,
  compact = false,
  className,
}: {
  open: boolean
  compact?: boolean
  className: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="overflow-hidden"
        >
          <div className={className}>
            <IosSteps compact={compact} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Home banner inviting the user to install the PWA.
 * Shows the native button (Chrome/Edge) or the iPhone guide (Safari).
 * Hidden once installed or when the user postponed the invitation.
 */
export function InstallBanner() {
  const reduceMotion = useReducedMotion()
  const { available, canInstall, isIOS, install, postpone } = useInstallPrompt()
  const [guideOpen, setGuideOpen] = useState(false)

  if (!available) return null

  const action: {
    label: string
    onClick: () => void
    expanded?: boolean
    icon?: LucideIcon
  } | null = isIOS
    ? {
        label: 'Cómo instalar en iPhone',
        onClick: () => setGuideOpen((v) => !v),
        expanded: guideOpen,
      }
    : canInstall
      ? { label: 'Instalar app', onClick: () => void install(), icon: Download }
      : null

  return (
    <motion.section
      aria-label="Instalar SensiBrew"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
      className="glass-panel relative mt-8 overflow-hidden rounded-2xl p-5 sm:p-6"
    >
      {/* Subtle amber glow in the corner */}
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
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              aria-expanded={action.expanded}
              className="btn-accent px-5 py-2.5 text-sm"
            >
              {action.icon && <action.icon className="h-4 w-4" aria-hidden />}
              {action.label}
            </button>
          )}
          <button
            type="button"
            onClick={postpone}
            className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-sb-muted transition-colors hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            <X className="mr-1 h-3.5 w-3.5" aria-hidden />
            Ahora no
          </button>
        </div>
      </div>

      <IosInstallGuide
        open={guideOpen && isIOS}
        className="mt-4 rounded-xl border border-sb-border bg-sb-fill p-4"
      />
    </motion.section>
  )
}
