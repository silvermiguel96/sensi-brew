import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { americanPaleAle } from '../data/americanPaleAle'
import { BeerStyleDetail } from '../components/beerstyle/BeerStyleDetail'

/** Ruta showcase de la nueva página de detalle (modelo BeerStyle). */
export function BeerStylePage() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto w-full max-w-4xl px-4 pt-6 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" /> Catálogo
        </Link>
      </div>
      <BeerStyleDetail style={americanPaleAle} />
    </motion.div>
  )
}
