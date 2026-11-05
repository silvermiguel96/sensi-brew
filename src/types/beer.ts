/** BJCP guides supported by the catalog. */
export type Guide = '2021' | '2015'

/** Sensory radar intensity (0 = absent, 5 = dominant). */
export interface SensoryIntensity {
  bitterness: number
  malt: number
  hops: number
  body: number
  carbonation: number
  fruityEsters: number
}

/** [min, max] range of a vital statistic. */
export type Range = [number, number]

export interface VitalStats {
  ibu: Range | null
  srm: Range | null
  abv: Range | null
}

export interface SensoryProfile {
  intensity: SensoryIntensity
  appearance: string
  aroma: string
  flavor: string
  mouthfeel: string
  descriptors: string[]
}

export interface Pairing {
  dish: string
  keyIngredients: string[]
  chemistry: string
}

export type DishCategory = 'meat' | 'cheese' | 'dessert' | 'seafood'

/** Suggested dish for the food-first carousel. */
export interface SuggestedDish {
  name: string
  category: DishCategory
  /** Emoji used as the offline "image" of the dish. */
  emoji: string
  /** Affinity with the style, 1–5. */
  affinity: number
  /** Pairing principle, in 2–4 words. */
  principle: string
}

/** Recommended serving glass for the style. */
export interface Glass {
  type: string
  capacityMl: number
  reason: string
}

export interface Beer {
  id: string
  name: string
  category: string
  guide: string
  vitalStats: VitalStats
  sensoryProfile: SensoryProfile
  pairings: Pairing[]
  suggestedDishes: SuggestedDish[]
  glass: Glass
}
