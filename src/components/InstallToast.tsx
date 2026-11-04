import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Download, X, type LucideIcon } from 'lucide-react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { GuiaDesplegable } from './InstallBanner'

/** Retraso antes de mostrar el toast (ms) para no interrumpir la llegada. */
const RETRASO_MS = 5000

/**
 * Toast inferior discreto que invita a instalar la app fuera del Home
 * (en el Home ya está el banner, así que aquí no se duplica).
 * Se oculta si ya está instalada o si el usuario pospuso la invitación.
 */
export function InstallToast() {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const { disponible, puedeInstalar, esIOS, instalar, posponer } = useInstallPrompt()
  const [visible, setVisible] = useState(false)
  const [guiaAbierta, setGuiaAbierta] = useState(false)

  const enHome = location.pathname === '/'
  const mostrar = disponible && !enHome && visible

  useEffect(() => {
    if (!disponible || enHome) return
    const t = window.setTimeout(() => setVisible(true), RETRASO_MS)
    return () => window.clearTimeout(t)
  }, [disponible, enHome])

  const cerrar = () => {
    setVisible(false)
    posponer()
  }

  const accion: {
    etiqueta: string
    onClick: () => void
    expanded?: boolean
    icono?: LucideIcon
  } | null = esIOS
    ? {
        etiqueta: 'Ver instrucciones',
        onClick: () => setGuiaAbierta((v) => !v),
        expanded: guiaAbierta,
      }
    : puedeInstalar
      ? { etiqueta: 'Instalar', onClick: () => void instalar() }
      : null

  return (
    <AnimatePresence>
      {mostrar && (
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
                {esIOS
                  ? 'En iPhone se instala desde Safari en 3 pasos.'
                  : 'Instálala y úsala sin internet, desde tu pantalla de inicio.'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {accion && (
                  <button
                    type="button"
                    onClick={accion.onClick}
                    aria-expanded={accion.expanded}
                    className="btn-accent px-4 py-1.5 text-xs"
                  >
                    {accion.icono && <accion.icono className="h-4 w-4" aria-hidden />}
                    {accion.etiqueta}
                  </button>
                )}
                <button
                  type="button"
                  onClick={cerrar}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-sb-muted transition-colors hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
                >
                  Ahora no
                </button>
              </div>

              <GuiaDesplegable
                abierta={guiaAbierta && esIOS}
                compacta
                className="mt-3 border-t border-sb-border pt-3"
              />
            </div>
            <button
              type="button"
              onClick={cerrar}
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
