import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, Share2 } from 'lucide-react'
import { americanPaleAle } from '../data/americanPaleAle'
import { BeerStyleDetail } from '../components/beerstyle/BeerStyleDetail'

/** Ruta showcase de la nueva página de detalle (modelo BeerStyle). */
export function BeerStylePage() {
  const reduceMotion = useReducedMotion()
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const prevTitle = document.title
    document.title = `${americanPaleAle.nombre} (${americanPaleAle.id}) — SensiBrew BJCP 2021`

    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Perfil sensorial, rangos técnicos y maridajes para el estilo ${americanPaleAle.nombre} (BJCP ${americanPaleAle.id}).`
      )
    }

    return () => {
      document.title = prevTitle
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc)
    }
  }, [])

  const handleCompartir = async () => {
    const url = window.location.href
    const datos = {
      title: `${americanPaleAle.nombre} (${americanPaleAle.id}) — SensiBrew`,
      text: `Perfil sensorial y maridajes de ${americanPaleAle.nombre} (BJCP ${americanPaleAle.id})`,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(datos)
        return
      } catch {
        // Fallback a portapapeles
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" /> Catálogo
        </Link>

        <button
          type="button"
          onClick={handleCompartir}
          aria-label="Compartir estilo"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-zinc-50 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none"
        >
          {copiado ? (
            <>
              <Check className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-amber-300">¡Enlace copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>Compartir</span>
            </>
          )}
        </button>
      </div>
      <BeerStyleDetail style={americanPaleAle} />
    </motion.div>
  )
}
