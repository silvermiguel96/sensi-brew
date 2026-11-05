import type { DishCategory } from '../types/beer'
import { Beef, CakeSlice, Fish, Milk, type LucideIcon } from 'lucide-react'

interface DishCategoryConfig {
  label: string
  icon: LucideIcon
  /** Gradient used as the dish "image" (offline, no assets). */
  gradient: string
  chipClass: string
}

/** Visual config of each dish category. */
export const DISH_CATEGORIES: Record<DishCategory, DishCategoryConfig> = {
  meat: {
    label: 'Carne',
    icon: Beef,
    gradient: 'linear-gradient(135deg, #450a0a 0%, #b91c1c 52%, #f97316 100%)',
    chipClass: 'border-red-500/20 bg-red-950/40 text-red-200',
  },
  cheese: {
    label: 'Queso',
    icon: Milk,
    gradient: 'linear-gradient(135deg, #451a03 0%, #d97706 52%, #fde68a 100%)',
    chipClass: 'border-amber-500/20 bg-amber-950/40 text-amber-200',
  },
  dessert: {
    label: 'Postre',
    icon: CakeSlice,
    gradient: 'linear-gradient(135deg, #500724 0%, #db2777 52%, #fbbf24 100%)',
    chipClass: 'border-pink-500/20 bg-pink-950/40 text-pink-200',
  },
  seafood: {
    label: 'Marisco',
    icon: Fish,
    gradient: 'linear-gradient(135deg, #083344 0%, #0e7490 52%, #67e8f9 100%)',
    chipClass: 'border-cyan-500/20 bg-cyan-950/40 text-cyan-200',
  },
}
