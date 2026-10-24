import type { CategoriaMaridaje } from '../types/beer'
import { Beef, CakeSlice, Fish, Milk, type LucideIcon } from 'lucide-react'

interface CategoriaConfig {
  label: string
  icon: LucideIcon
  /** Gradiente usado como "imagen" del plato (offline, sin assets). */
  gradient: string
  chipClass: string
}

/** Configuración visual de cada categoría de maridaje. */
export const CATEGORIAS_MARIDAJE: Record<CategoriaMaridaje, CategoriaConfig> = {
  carne: {
    label: 'Carne',
    icon: Beef,
    gradient: 'linear-gradient(135deg, #450a0a 0%, #b91c1c 52%, #f97316 100%)',
    chipClass: 'border-red-500/20 bg-red-950/40 text-red-200',
  },
  queso: {
    label: 'Queso',
    icon: Milk,
    gradient: 'linear-gradient(135deg, #451a03 0%, #d97706 52%, #fde68a 100%)',
    chipClass: 'border-amber-500/20 bg-amber-950/40 text-amber-200',
  },
  postre: {
    label: 'Postre',
    icon: CakeSlice,
    gradient: 'linear-gradient(135deg, #500724 0%, #db2777 52%, #fbbf24 100%)',
    chipClass: 'border-pink-500/20 bg-pink-950/40 text-pink-200',
  },
  marisco: {
    label: 'Marisco',
    icon: Fish,
    gradient: 'linear-gradient(135deg, #083344 0%, #0e7490 52%, #67e8f9 100%)',
    chipClass: 'border-cyan-500/20 bg-cyan-950/40 text-cyan-200',
  },
}
