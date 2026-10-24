/**
 * Modelo de datos para la nueva vista de detalle de estilo (BeerStyle).
 * Iteración de diseño: aún no reemplaza al modelo `Beer` de beers.json.
 */

/** Rango [mín, máx] con su unidad de medida. */
export interface TechnicalRange {
  min: number
  max: number
  unit: string
}

/** Especificación técnica con escala estándar para dibujar la barra de rango. */
export interface TechnicalSpec extends TechnicalRange {
  /** Valor máximo de la escala estándar de la métrica (ej. IBU: 100). */
  scaleMin: number
  scaleMax: number
  label: string
}

/** Ejes del perfil organoléptico, escala 1–5. */
export type SensoryAxis = 'aroma' | 'malta' | 'lupulo' | 'amargor' | 'dulzor' | 'cuerpo'
export type SensoryProfile = Record<SensoryAxis, number>

export const SENSORY_AXES: Array<{ key: SensoryAxis; label: string }> = [
  { key: 'aroma', label: 'Aroma' },
  { key: 'malta', label: 'Malta' },
  { key: 'lupulo', label: 'Lúpulo' },
  { key: 'amargor', label: 'Amargor' },
  { key: 'dulzor', label: 'Dulzor' },
  { key: 'cuerpo', label: 'Cuerpo' },
]

export type PairingCategory = 'carnes' | 'quesos' | 'postres'

export interface FoodPairing {
  categoria: PairingCategory
  /** Descripción breve de por qué funciona la categoría con este estilo. */
  descripcion: string
  platos: string[]
}

export interface BeerStyle {
  id: string
  nombre: string
  categoria: string
  guiaBjcp: string
  colorSrm: {
    /** Color HEX representativo del estilo. */
    hex: string
    min: number
    max: number
  }
  rangosTecnicos: {
    abv: TechnicalSpec
    ibu: TechnicalSpec
    temperaturaServicio: TechnicalSpec
  }
  perfilSensorial: SensoryProfile
  notasSabor: string[]
  /** Párrafo que explica las notas de sabor de este estilo. */
  resumenNotas: string
  maridajes: FoodPairing[]
}
