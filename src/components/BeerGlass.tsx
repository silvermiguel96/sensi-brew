import { shade, srmToColor } from '../lib/srm'

interface BeerGlassProps {
  /** Valor SRM usado para pintar el líquido (si no se pasa `hex`). */
  srm?: number
  /** Color HEX exacto que sobrescribe la escala SRM. */
  hex?: string
  /** Clases de tamaño/posición externas (el componente es responsive por defecto). */
  className?: string
  /** Muestra las burbujas ascendiendo (decorativo). */
  bubbles?: boolean
}

/**
 * Copa de cerveza dibujada 100% con CSS: líquido con gradiente SRM,
 * espuma y burbujas animadas. Cero assets de imagen => peso 0 offline.
 */
export function BeerGlass({ srm, hex, className = '', bubbles = true }: BeerGlassProps) {
  const color = hex ?? srmToColor(srm ?? 8)

  return (
    <div
      className={`relative h-48 w-32 overflow-hidden rounded-b-[2.75rem] rounded-t-lg border border-slate-100/15 bg-slate-100/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.35)] ${className}`}
      role="img"
      aria-label={
        hex
          ? `Cerveza de color ${hex}`
          : `Color de cerveza equivalente a ${srm ?? 8} SRM`
      }
    >
      {/* Líquido */}
      <div
        className="absolute inset-x-0 bottom-0 h-[80%]"
        style={{
          background: `linear-gradient(180deg, ${color} 0% 55%, ${shade(color, 0.72)} 100%)`,
        }}
      />

      {/* Burbujas (CSS puro) */}
      {bubbles && (
        <div className="absolute inset-x-0 bottom-0 h-[76%] overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => {
            const left = 12 + ((i * 23) % 72)
            const size = 3 + (i % 3) * 2
            return (
              <span
                key={i}
                className="animate-bubble absolute bottom-2 rounded-full bg-white/70"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size,
                  ['--duration' as string]: `${3 + (i % 5) * 0.7}s`,
                  ['--delay' as string]: `${i * 0.45}s`,
                  ['--rise' as string]: `-${90 + (i % 4) * 18}px`,
                }}
              />
            )
          })}
        </div>
      )}

      {/* Espuma */}
      <div className="animate-foam absolute inset-x-[-6%] top-[15%] h-[10%] rounded-[50%] bg-foam/95 shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
      <div className="absolute inset-x-0 top-[19%] h-[9%] bg-foam/85" />

      {/* Brillo del vidrio */}
      <div className="absolute inset-y-3 left-2 w-1.5 rounded-full bg-white/25 blur-[2px]" />
    </div>
  )
}
