import type { Rango } from '../types/beer'

export function textoRango(rango: Rango | null): string {
  if (!rango) return 'Variable'
  return `${rango[0]}–${rango[1]}`
}
