import { useDeferredValue, useMemo, useState } from 'react'
import { categorias, searchBeers } from '../data/beers'

/** Estado del buscador y filtro de categoría del Home. */
export function useBeers() {
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState<string | null>(null)

  // React 19: diferir el query para mantener la respuesta del input fluida sin bloquear el hilo principal
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => searchBeers(deferredQuery, categoria), [deferredQuery, categoria])

  const toggleCategoria = (cat: string) => {
    setCategoria((prev) => (prev === cat ? null : cat))
  }

  return { query, setQuery, categoria, setCategoria, toggleCategoria, results, categorias }
}
