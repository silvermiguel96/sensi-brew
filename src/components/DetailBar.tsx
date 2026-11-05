import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Share2 } from 'lucide-react'

/** Back-to-catalog link and share button shown on style pages. */
export function DetailBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        // URL only: on macOS the `text` field gets glued to the link and breaks it
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
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
        onClick={share}
        aria-live="polite"
        className="inline-flex items-center gap-1.5 rounded-full border border-sb-border bg-sb-fill px-3 py-1.5 text-xs font-semibold text-sb-body transition-colors hover:border-sb-border-strong hover:bg-sb-fill-strong hover:text-sb-title focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
      >
        {copied ? (
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
