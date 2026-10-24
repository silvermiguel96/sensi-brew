/**
 * Escala SRM (Standard Reference Method) traducida a colores CSS.
 * Permite pintar el "color real" de la cerveza sin ningún asset de imagen:
 * todo es gradiente generado, ideal para una PWA offline ligera.
 */
const SRM_SCALE: Array<{ srm: number; hex: string }> = [
  { srm: 2, hex: '#f7efb0' },
  { srm: 3, hex: '#f3e69a' },
  { srm: 4, hex: '#efdd84' },
  { srm: 6, hex: '#e8c95f' },
  { srm: 8, hex: '#e2b344' },
  { srm: 10, hex: '#db9c31' },
  { srm: 13, hex: '#cf7f24' },
  { srm: 15, hex: '#c46c1f' },
  { srm: 18, hex: '#b4551b' },
  { srm: 20, hex: '#a6481a' },
  { srm: 24, hex: '#8d3817' },
  { srm: 28, hex: '#712915' },
  { srm: 30, hex: '#5f2214' },
  { srm: 35, hex: '#401411' },
  { srm: 40, hex: '#2c0d0e' },
]

/** Devuelve el color hex más cercano a un valor SRM. */
export function srmToColor(srm: number): string {
  if (srm <= SRM_SCALE[0].srm) return SRM_SCALE[0].hex
  const last = SRM_SCALE[SRM_SCALE.length - 1]
  if (srm >= last.srm) return last.hex

  let nearest = SRM_SCALE[0]
  for (const stop of SRM_SCALE) {
    if (Math.abs(stop.srm - srm) < Math.abs(nearest.srm - srm)) nearest = stop
  }
  return nearest.hex
}

/** Color del rango SRM de una receta (usa el punto medio). */
export function srmRangeToColor(range: [number, number]): string {
  return srmToColor((range[0] + range[1]) / 2)
}

/** Oscurece un hex (factor 0 = negro, 1 = color original). */
export function shade(hex: string, factor: number): string {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  const r = Math.round(((num >> 16) & 0xff) * factor)
  const g = Math.round(((num >> 8) & 0xff) * factor)
  const b = Math.round((num & 0xff) * factor)
  return `rgb(${r}, ${g}, ${b})`
}

/** Gradiente vertical usado en la barra de rango SRM. */
export const SRM_GRADIENT = `linear-gradient(90deg, ${SRM_SCALE.map(
  (s) => `${s.hex} ${Math.round((s.srm / 40) * 100)}%`,
).join(', ')})`
