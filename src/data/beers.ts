import type { Beer, Guide } from '../types/beer'
import rawBeers2015 from './beers-2015.json'
import rawBeers2021 from './beers-2021.json'

/**
 * Static BJCP 2021 and 2015 catalogs.
 * Both JSON files ship inside the bundle, so the app works 100% offline
 * with no database or network requests.
 *
 * Note: TS infers `ibu: number[]` from the JSON, hence the cast to `Beer[]`.
 */
export const catalogs: Record<Guide, Beer[]> = {
  '2021': rawBeers2021 as unknown as Beer[],
  '2015': rawBeers2015 as unknown as Beer[],
}

/** Unique categories of a guide, sorted alphabetically. */
export function getCategories(guide: Guide): string[] {
  return [...new Set(catalogs[guide].map((b) => b.category))].sort()
}

/** Finds a style by id within a guide. */
export function getBeerById(guide: Guide, id: string): Beer | undefined {
  const needle = id.trim().toLowerCase()
  return catalogs[guide].find((b) => b.id.toLowerCase() === needle)
}

/** Filters a guide's styles by free text and an optional category. */
export function searchBeers(guide: Guide, query: string, category?: string | null): Beer[] {
  const q = query.trim().toLowerCase()
  return catalogs[guide].filter((beer) => {
    if (category && beer.category !== category) return false
    if (!q) return true
    const haystack = [
      beer.id,
      beer.name,
      beer.category,
      ...beer.sensoryProfile.descriptors,
      ...beer.pairings.map((p) => p.dish),
      ...beer.suggestedDishes.map((d) => d.name),
      beer.glass.type,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
