import { useDeferredValue, useMemo, useState } from 'react'
import { categorias, searchBeers } from '../data/beers'
import type { Beer, Rango } from '../types/beer'

/** Opciones de orden del catálogo. */
export type OrdenCatalogo = 'relevante' | 'az' | 'abv' | 'ibu'

export const ORDENES: { value: OrdenCatalogo; label: string }[] = [
  { value: 'relevante', label: 'Relevante' },
  { value: 'az', label: 'A–Z' },
  { value: 'abv', label: 'ABV ↓' },
  { value: 'ibu', label: 'IBU ↓' },
]

const mid = (r: Rango | null) => (r ? (r[0] + r[1]) / 2 : 0)

const comparadores = {
  az: (a: Beer, b: Beer) => a.nombre_estilo.localeCompare(b.nombre_estilo, 'es'),
  abv: (a: Beer, b: Beer) =>
    mid(b.estadisticas_vitales.abv) - mid(a.estadisticas_vitales.abv),
  ibu: (a: Beer, b: Beer) =>
    mid(b.estadisticas_vitales.ibu) - mid(a.estadisticas_vitales.ibu),
} satisfies Record<Exclude<OrdenCatalogo, 'relevante'>, (a: Beer, b: Beer) => number>

/** Estado del buscador, filtro de categoría y orden del Home. */
export function useBeers() {
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState<string | null>(null)
  const [orden, setOrden] = useState<OrdenCatalogo>('relevante')

  // React 19: diferir el query para mantener la respuesta del input fluida sin bloquear el hilo principal
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => {
    const base = searchBeers(deferredQuery, categoria)
    if (orden === 'relevante') return base
    return [...base].sort(comparadores[orden])
  }, [deferredQuery, categoria, orden])

  const toggleCategoria = (cat: string) => {
    setCategoria((prev) => (prev === cat ? null : cat))
  }

  /** Limpia búsqueda, filtro y orden (usado en el estado vacío). */
  const limpiarFiltros = () => {
    setQuery('')
    setCategoria(null)
    setOrden('relevante')
  }

  const hayFiltros = query !== '' || categoria !== null || orden !== 'relevante'

  return {
    query,
    setQuery,
    categoria,
    setCategoria,
    toggleCategoria,
    orden,
    setOrden,
    results,
    categorias,
    limpiarFiltros,
    hayFiltros,
  }
}
