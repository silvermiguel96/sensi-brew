import { useDeferredValue, useMemo, useState } from 'react'
import { getCategories, searchBeers } from '../data/beers'
import type { Beer, Guide, Range } from '../types/beer'

/** Catalog sort options. */
export type SortOrder = 'relevant' | 'az' | 'abv' | 'ibu'

export const SORT_ORDERS: { value: SortOrder; label: string }[] = [
  { value: 'relevant', label: 'Relevante' },
  { value: 'az', label: 'A–Z' },
  { value: 'abv', label: 'ABV ↓' },
  { value: 'ibu', label: 'IBU ↓' },
]

const mid = (r: Range | null) => (r ? (r[0] + r[1]) / 2 : 0)

const comparators = {
  az: (a: Beer, b: Beer) => a.name.localeCompare(b.name, 'es'),
  abv: (a: Beer, b: Beer) => mid(b.vitalStats.abv) - mid(a.vitalStats.abv),
  ibu: (a: Beer, b: Beer) => mid(b.vitalStats.ibu) - mid(a.vitalStats.ibu),
} satisfies Record<Exclude<SortOrder, 'relevant'>, (a: Beer, b: Beer) => number>

/** Search, category filter and sort state of the Home catalog for a guide. */
export function useBeers(guide: Guide) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevant')
  const [prevGuide, setPrevGuide] = useState(guide)

  // Reset the active category when the guide changes (React's pattern for state derived from props)
  if (prevGuide !== guide) {
    setPrevGuide(guide)
    setCategory(null)
  }

  const categories = useMemo(() => getCategories(guide), [guide])

  // Defer the query so typing stays responsive while filtering
  const deferredQuery = useDeferredValue(query)
  const results = useMemo(() => {
    const base = searchBeers(guide, deferredQuery, category)
    if (sortOrder === 'relevant') return base
    return [...base].sort(comparators[sortOrder])
  }, [guide, deferredQuery, category, sortOrder])

  const toggleCategory = (cat: string) => {
    setCategory((prev) => (prev === cat ? null : cat))
  }

  /** Clears search, filter and sort (used by the empty state). */
  const clearFilters = () => {
    setQuery('')
    setCategory(null)
    setSortOrder('relevant')
  }

  const hasFilters = query !== '' || category !== null || sortOrder !== 'relevant'

  return {
    query,
    setQuery,
    category,
    setCategory,
    toggleCategory,
    sortOrder,
    setSortOrder,
    results,
    categories,
    clearFilters,
    hasFilters,
  }
}
