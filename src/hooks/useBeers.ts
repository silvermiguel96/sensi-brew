import { useMemo, useState } from 'react'
import { categorias, searchBeers } from '../data/beers'

/** Estado del buscador y filtro de categoría del Home. */
export function useBeers() {
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState<string | null>(null)

  const results = useMemo(() => searchBeers(query, categoria), [query, categoria])

  const toggleCategoria = (cat: string) => {
    setCategoria((prev) => (prev === cat ? null : cat))
  }

  return { query, setQuery, categoria, setCategoria, toggleCategoria, results, categorias }
}
