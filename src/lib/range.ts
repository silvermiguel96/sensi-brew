import type { Range } from '../types/beer'

export function formatRange(range: Range | null): string {
  if (!range) return 'Variable'
  return `${range[0]}–${range[1]}`
}
