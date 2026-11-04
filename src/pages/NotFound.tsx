import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Compass } from 'lucide-react'

/** Página 404 con estilo consistente con el resto de la app. */
export function NotFound() {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Página no encontrada — SensiBrew'
    return () => {
      document.title = prevTitle
    }
  }, [])

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      className="mx-auto w-full max-w-lg px-4 pt-16 pb-24 text-center"
    >
      <div className="glass-panel rounded-2xl px-6 py-12">
        <Compass className="mx-auto h-10 w-10 text-sb-accent/80" aria-hidden />
        <p className="text-gradient-gold mt-4 font-serif text-5xl font-bold">404</p>
        <h1 className="mt-3 text-xl font-semibold text-sb-text">
          Esta ruta no existe
        </h1>
        <p className="text-balance-es mx-auto mt-2 max-w-sm text-sm leading-relaxed text-sb-muted">
          Puede que el enlace esté anticuado o que la dirección tenga un error.
          El catálogo completo te espera.
        </p>
        <Link
          to="/"
          className="btn-accent mt-6 px-5 py-2.5 text-sm"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al catálogo
        </Link>
      </div>
    </motion.div>
  )
}
