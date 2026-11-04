import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Share2 } from 'lucide-react'

/** Enlace al catálogo y botón de compartir, común a las fichas de estilo. */
export function BarraDetalle({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false)

  const compartir = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        // Solo la URL: en macOS el campo `text` se pega al enlace y lo rompe
        await navigator.share({ title: titulo, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    window.setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="flex items-center justify-between">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sb-muted transition-colors hover:text-sb-accent focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Catálogo
      </Link>
      <button
        type="button"
        onClick={compartir}
        aria-live="polite"
        className="inline-flex items-center gap-1.5 rounded-full border border-sb-border bg-sb-fill px-3 py-1.5 text-xs font-semibold text-sb-body transition-colors hover:border-sb-border-strong hover:bg-sb-fill-strong hover:text-sb-title focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
      >
        {copiado ? (
          <>
            <Check className="h-3.5 w-3.5 text-sb-accent" aria-hidden />
            <span className="text-sb-accent">¡Enlace copiado!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 text-sb-muted" aria-hidden />
            <span>Compartir</span>
          </>
        )}
      </button>
    </div>
  )
}
