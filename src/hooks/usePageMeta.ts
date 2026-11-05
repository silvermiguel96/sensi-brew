import { useEffect } from 'react'

/**
 * Sets the tab title and meta description.
 * If either is null the document is left untouched. Both are restored on unmount.
 */
export function usePageMeta(title: string | null, description: string | null) {
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
