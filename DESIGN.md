# Design System — SensiBrew

Sistema visual de la PWA: **Cava de cata premium**, oscuridad neutra profunda, un solo acento cálido y luz difusa que emana de la cerveza. Todo se genera con CSS y tokens de Tailwind v4; no hay assets de imagen ni fuentes externas.

Fuente de verdad del código: `src/index.css` (`@theme`), `src/lib/srm.ts`, `src/lib/pairing.ts`. Si este documento y el código divergen, gana el código y se corrige este archivo.

---

## 1. Principios

1. **Oscuro neutro, como una cava.** El fondo es negro suave (`zinc-950`), sin tonos azules. La única calidez real proviene del color de la cerveza.
2. **Un acento.** El ámbar marca acción, foco, dato y jerarquía. No hay segundo color de marca.
3. **El color de la cerveza manda.** El único color libre de la interfaz es el SRM del estilo; el resto de la paleta se calla para dejarlo brillar.
4. **Luz ambiental, no neón.** La profundidad se logra con destellos difusos amplios y de muy baja opacidad, imitando la luz rebotando en el cristal.
5. **El aire estructura, no las cajas.** Evitamos encerrar la información en múltiples bordes; usamos el espacio negativo y el contraste tipográfico para guiar el ojo.
6. **Contraste primero.** Si un color no cumple AA en su rol, no se usa.

---

## 2. Tokens de color

### 2.1 Neutros (superficie y texto)

| Token | Clase Tailwind | HEX | Rol |
| --- | --- | --- | --- |
| `base` | `bg-zinc-950` | `#09090b` | Fondo absoluto de app y body |
| `surface-1` | `glass-panel` | `#18181b` 40 % → `#09090b` 80 % | Panel principal (glassmorphism) |
| `surface-2` | `bg-zinc-900` | `#18181b` | Chips, controles, pestañas inactivas |
| `sunken` | `bg-zinc-950/70` | `#09090b` | Contenedor de tablist, ítem de lista |
| `track` | `bg-zinc-800` | `#27272a` | Pista de barras de progreso |
| `border-subtle` | `border-white/5` | `rgba(255,255,255,0.05)` | Borde de cristal pulido para paneles |
| `border-strong` | `border-white/10` · `ring-white/10` | `rgba(255,255,255,0.1)` | Borde de chip, control y pista |
| `text-display` | `text-zinc-50` | `#fafafa` | Títulos principales (Serif) |
| `text-heading` | `text-zinc-100` | `#f4f4f5` | Título de secciones |
| `text-body` | `text-zinc-300` | `#d4d4d8` | Párrafos descriptivos |
| `text-secondary` | `text-zinc-400` | `#a1a1aa` | Datos técnicos, etiquetas, IBU/ABV |
| `text-muted` | `text-zinc-600` | `#52525b` | Footer y metadatos micro |
| `text-on-accent` | `text-zinc-950` | `#09090b` | Texto e iconos sobre ámbar |

### 2.2 Acento (ámbar)

| Token | Clase Tailwind | HEX | Rol |
| --- | --- | --- | --- |
| `accent` | `text-amber-400` · `ring-amber-400` | `#fbbf24` | Acento primario: iconos, foco, indicador activo |
| `accent-soft` | `text-amber-300/80` | `#fcd34d` | Acento muy sutil sobre superficie |
| `accent-ink` | `text-amber-200` | `#fde68a` | Texto en chips |
| `accent-solid` | `bg-amber-500` | `#f59e0b` | Base de relleno para controles clave |
| `accent-deep` | `from-amber-700` | `#b45309` | Inicio de barras de rango |
| `glow` | `--color-amber-glow` | `#fbbf24` | `::selection` al 35% |

### 2.3 Semánticos por categoría de maridaje (Aislados)

Aislados en `src/lib/pairing.ts`. Son los únicos tonos ajenos a la paleta base y **no se reutilizan fuera de este módulo**.

| Categoría | Chip (Fondo / Borde / Texto) |
| --- | --- |
| Carne | `bg-red-950/40 border-red-500/20 text-red-200` |
| Queso | `bg-amber-950/40 border-amber-500/20 text-amber-200` |
| Postre | `bg-pink-950/40 border-pink-500/20 text-pink-200` |
| Marisco | `bg-cyan-950/40 border-cyan-500/20 text-cyan-200` |

### 2.4 Escala SRM (color dinámico)

Definida en `src/lib/srm.ts`. Es dato, no paleta: se aplica al líquido del vaso, al glow radial del panel (`${hex}14` ≈ 8 %) y al relleno del radar sensorial (`fillOpacity 0.2`).

| SRM | 2 | 3 | 4 | 6 | 8 | 10 | 13 | 15 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| HEX | `#f7efb0` | `#f3e69a` | `#efdd84` | `#e8c95f` | `#e2b344` | `#db9c31` | `#cf7f24` | `#c46c1f` |

| SRM | 18 | 20 | 24 | 28 | 30 | 35 | 40 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HEX | `#b4551b` | `#a6481a` | `#8d3817` | `#712915` | `#5f2214` | `#401411` | `#2c0d0e` |

---

## 3. Superficies y elevación

Para mantener la ligereza visual y el aspecto premium, usamos solo dos niveles. Evitamos anidar cajas.

| Nivel | Receta | Ejemplo |
| --- | --- | --- |
| **0 · Fondo** | `bg-zinc-950` | `App`, body |
| **1 · Panel** | `glass-panel` · `rounded-2xl` | Card de catálogo, vista de detalle |

`glass-panel` (utilidad propia en CSS):

```css
background: linear-gradient(160deg, rgba(24, 24, 27, 0.4), rgba(9, 9, 11, 0.8));
border: 1px solid rgba(255, 255, 255, 0.05); /* Borde de cristal sutil */
backdrop-filter: blur(24px); /* Fuerte desenfoque para suavizar el fondo */

```

Regla de oro: **No encerramos datos dentro de más cajas**. Los elementos técnicos (IBU, descriptores) flotan sobre el `glass-panel` y se separan mediante líneas finas (`divide-y divide-white/5`) o espacio en blanco.

---

## 4. Luz y Ambiente

La luz debe sentirse como un reflejo difuso en un ambiente oscuro, no como un botón de neón brillante.

| Efecto | Valor | Dónde |
| --- | --- | --- |
| Glow de acento (Sutil) | `shadow-[0_0_40px_rgba(251,191,36,0.08)]` | Logo, botón principal |
| Glow SRM (Ambiental) | `radial-gradient(100% 100% at 50% 0%, ${hex}14, transparent 60%)` | Header de detalle del estilo |

---

## 5. Tipografía

Doble familia tipográfica nativa para lograr un equilibrio editorial y técnico.

```css
/* Para nombres de estilos y títulos principales (Elegancia/Tradición) */
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;

/* Para UI, datos técnicos y descripciones (Precisión/Lectura) */
--font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

```

| Rol | Familia | Tamaño | Peso | Extras |
| --- | --- | --- | --- | --- |
| Título hero (Estilo) | **Serif** | `text-4xl` → `text-5xl` | `font-normal` | `tracking-normal`, `text-zinc-50` |
| H2 de sección | Sans | `text-lg` | `font-semibold` | `tracking-wide`, `text-zinc-100` |
| Cuerpo | Sans | `text-sm` | `font-normal` | `leading-relaxed`, `text-zinc-300`, `text-pretty` |
| Dato Técnico | Sans | `text-2xl` | `font-medium` | `tabular-nums`, `text-zinc-100` |
| Label (Metadato) | Sans | `text-xs` | `font-medium` | `tracking-widest`, `uppercase`, `text-zinc-400` |

Reglas: `tabular-nums` es obligatorio en **toda** cifra (IBU, SRM, ABV, %); la tipografía Serif no usa pesos *black* ni tracking apretado (debe respirar).

---

## 6. Forma y espaciado

**Radios**

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-md` | 6 px | Badges técnicos pequeños |
| `rounded-2xl` | 16 px | Panel principal (`glass-panel`) |
| `rounded-full` | — | Chips de sabor, pills |

**Layout**

* Contenedor: `mx-auto w-full max-w-4xl px-4 sm:px-6` (Un poco más estrecho para facilitar la lectura estilo revista).
* Ritmo vertical amplio: `mt-10` entre grandes secciones, dejando respirar la información.
* Header sticky: `h-14`, `border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl`.

---

## 7. Movimiento

Librería: Framer Motion. Las animaciones deben sentirse fluidas y reposadas, sin rebotes exagerados.
Curva estándar: `ease: [0.25, 1, 0.5, 1]`.

| Patrón | Duración | Notas |
| --- | --- | --- |
| Entrada de página | 0.5 s | Transición suave de `opacity` |
| Entrada escalonada | delay `0.05` s | Elementos de UI apareciendo progresivamente |
| Gráfico Radar | 0.8 s | Aparición sutil desde opacidad 0 |

Obligatorio: `useReducedMotion()` en cada componente animado y desactivar la animación (`initial={false}`, `animation: none`) cuando esté activo. Prohibido animar los `<path>` internos de Recharts agresivamente.

---

## 8. Accesibilidad

Foco visible único en todo el proyecto:

```txt
focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none

```

Contraste medido sobre `#09090b`:

| Combinación | Ratio | Veredicto |
| --- | --- | --- |
| `zinc-50` sobre base | ≈ 19.1:1 | AAA |
| `zinc-400` sobre base | ≈ 7.8:1 | AA (Perfecto para datos técnicos) |
| `amber-400` sobre base | ≈ 11.9:1 | AAA |
| `zinc-600` sobre base | ≈ 2.6:1 | **Solo texto no esencial/decorativo** |

---

## 9. Anti-patrones (Actualizado)

* ❌ **Usar colores Slate, Gray o Stone:** La familia neutra es estricta y únicamente **`zinc`**.
* ❌ **Cajas dentro de Cajas:** Prohibido anidar fondos sólidos o `glass-panels`. Usar espacio negativo o `border-white/5` para separar contenido.
* ❌ **Glows de Neón:** Prohibido usar sombras opacas. Los glows deben tener un máximo de opacidad de `0.08` a `0.1` y un spread/blur grande (ej. `40px`).
* ❌ **Bordes gruesos y coloreados:** Nada de `border-zinc-700`. Usar siempre el estilo "cristal" con `border-white/5` o `border-white/10`.
* ❌ **Texto Sans-serif pesado para Títulos:** Los nombres de cerveza usan la fuente Serif para denotar calidad y legado.
* ❌ **Iconos a todo color:** Los iconos heredan el color del texto (`text-zinc-400` o `text-amber-400`).