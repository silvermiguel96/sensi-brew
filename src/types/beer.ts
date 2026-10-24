/** Intensidad del radar sensorial (0 = ausente, 5 = dominante). */
export interface RadarIntensidad {
  amargor: number
  malta: number
  lupulo: number
  cuerpo: number
  carbonatacion: number
  esteres_frutales: number
}

/** Rango [mínimo, máximo] de una estadística vital. */
export type Rango = [number, number]

export interface EstadisticasVitales {
  ibu: Rango | null
  srm: Rango | null
  abv: Rango | null
}

export interface PerfilSensorial {
  radar_intensidad: RadarIntensidad
  apariencia: string
  aroma: string
  sabor: string
  sensacion_boca: string
  burbujas_descriptores: string[]
}

export interface Maridaje {
  plato: string
  ingredientes_clave: string[]
  justificacion_quimica: string
}

export type CategoriaMaridaje = 'carne' | 'queso' | 'postre' | 'marisco'

/** Plato sugerido para el carrusel food-first. */
export interface PlatoSugerido {
  nombre: string
  categoria: CategoriaMaridaje
  /** Emoji usado como "imagen" offline del plato. */
  emoji: string
  /** Nivel de afinidad con el estilo, 1–5. */
  afinidad: number
  /** Principio del maridaje, en 2–4 palabras. */
  principio: string
}

/** Vaso de servicio recomendado para el estilo. */
export interface TipoVaso {
  tipo: string
  capacidad_ml: number
  justificacion: string
}

export interface Beer {
  id: string
  nombre_estilo: string
  categoria: string
  guia_bjcp: string
  estadisticas_vitales: EstadisticasVitales
  perfil_sensorial: PerfilSensorial
  maridaje_gastronomico: Maridaje[]
  platos_sugeridos: PlatoSugerido[]
  tipo_vaso: TipoVaso
}
