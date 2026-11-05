import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Download, X, type LucideIcon } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { IosInstallGuide } from './InstallBanner'

/** Delay before showing the toast (ms) so it doesn't interrupt arrival. */
const DELAY_MS = 5000

/**
 * Discreet bottom toast inviting the user to install the app outside Home
 * (Home already has the banner, so it is not duplicated there).
 * Hidden once installed or when the user postponed the invitation.
 */
export function InstallToast() {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const { available, canInstall, isIOS, install, postpone } = useInstallPrompt()
  const [visible, setVisible] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  const onHome = location.pathname === '/'
  const show = available && !onHome && visible

  useEffect(() => {
    if (!available || onHome) return
    const t = window.setTimeout(() => setVisible(true), DELAY_MS)
    return () => window.clearTimeout(t)
  }, [available, onHome])

  const close = () => {
    setVisible(false)
    postpone()
  }

  const action: {
    label: string
    onClick: () => void
    expanded?: boolean
    icon?: LucideIcon
  } | null = isIOS
    ? {
        label: 'Ver instrucciones',
        onClick: () => setGuideOpen((v) => !v),
        expanded: guideOpen,
      }
    : canInstall
      ? { label: 'Instalar', onClick: () => void install() }
      : null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="glass-panel fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-md rounded-2xl p-4 sm:right-6 sm:left-auto sm:mx-0"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
              <Download className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-sb-title">Llévate SensiBrew contigo</p>
              <p className="mt-0.5 text-xs leading-relaxed text-sb-body">
                {isIOS
                  ? 'En iPhone se instala desde Safari en 3 pasos.'
                  : 'Instálala y úsala sin internet, desde tu pantalla de inicio.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {action && (
                  <button
                    type="button"
                    onClick={action.onClick}
                    aria-expanded={action.expanded}
                    className="btn-accent px-4 py-1.5 text-xs"
                  >
                    {action.icon && <action.icon className="h-4 w-4" aria-hidden />}
                    {action.label}
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-sb-muted transition-colors hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
                >
                  Ahora no
                </button>
              </div>

              <IosInstallGuide
                open={guideOpen && isIOS}
                compact
                className="mt-3 border-t border-sb-border pt-3"
              />
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar invitación a instalar"
              className="shrink-0 rounded-full p-1 text-sb-muted transition-colors hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
