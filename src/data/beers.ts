import type { Beer } from '../types/beer'
import rawBeers from './beers.json'

/**
 * Catálogo estático de estilos BJCP 2021.
 * El JSON se empaqueta dentro del bundle, por eso la app funciona 100% offline
 * sin base de datos ni peticiones de red.
 *
 * Nota: TS infiere `ibu: number[]` desde el JSON, de ahí el cast a `Beer[]`
 * (el tuple `[number, number]` es asignable a `number[]`, así que es seguro).
 */
export const beers = rawBeers as unknown as Beer[]

export const categorias = [...new Set(beers.map((b) => b.categoria))].sort()

export function getBeerById(id: string): Beer | undefined {
  const needle = id.trim().toLowerCase()
  return beers.find((b) => b.id.toLowerCase() === needle)
}

export function searchBeers(query: string, categoria?: string | null): Beer[] {
  const q = query.trim().toLowerCase()
  return beers.filter((beer) => {
    const matchCategoria = !categoria || beer.categoria === categoria
    if (!matchCategoria) return false
    if (!q) return true
    const haystack = [
      beer.id,
      beer.nombre_estilo,
      beer.categoria,
      ...beer.perfil_sensorial.burbujas_descriptores,
      ...beer.maridaje_gastronomico.map((m) => m.plato),
      ...beer.platos_sugeridos.map((p) => p.nombre),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}
