import { useEffect } from 'react'

/**
 * Pone el título y la meta description de la pestaña.
 * Si alguno es null, no toca el documento. Al salir, restaura ambos.
 */
export function useMetaPagina(title: string | null, description: string | null) {
  useEffect(() => {
    if (!title || !description) return
    const prevTitle = document.title
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    const prev = meta?.getAttribute('content') ?? null
    meta?.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (meta && prev) meta.setAttribute('content', prev)
    }
  }, [title, description])
}
