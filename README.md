# 🍺 SensiBrew

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PWA](https://img.shields.io/badge/PWA-offline--first-amber.svg)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg?logo=vite&logoColor=white)](https://vite.dev)

PWA **offline-first** para catadores y entusiastas de la cerveza, basada en la
**guía BJCP 2021**. Perfiles sensoriales, estadísticas vitales y **maridajes
gastronómicos** con justificación química.

Sin base de datos: el catálogo vive en `src/data/beers.json` y se empaqueta
dentro del bundle, por eso **la app completa funciona sin internet** tras la
primera visita.

## Stack

- **Vite + React 19 + TypeScript** (strict)
- **Tailwind CSS v4** — todos los visuales (color SRM, copa, espuma, burbujas) se
  generan con CSS, sin assets de imagen
- **vite-plugin-pwa** — service worker con precache de Workbox
- **Recharts** — radar de perfil sensorial
- **Framer Motion** — transiciones y animaciones de entrada
- **Lucide React** — iconografía

## Rutas

| Ruta            | Contenido                                                          |
| --------------- | ------------------------------------------------------------------ |
| `/`             | Catálogo con buscador por estilo, categoría, descriptor o plato   |
| `/estilo/18B`   | Ficha showcase (modelo `BeerStyle`) con tabs de maridaje          |
| `/estilo/:id`   | Ficha food-first (modelo `Beer`: 1A, 21A, 20B, 10A)               |

## Comandos

```bash
npm install        # dependencias
npm run dev        # desarrollo (HMR)
npm run check      # TypeScript + oxlint
npm run build      # build de producción + generación del service worker
npm run preview    # sirve el build (aquí se prueba el modo offline real)
```

### Probar el modo offline
1. `npm run build && npm run preview`
2. Abre `http://localhost:4173` en el navegador
3. DevTools → Application → Service Workers → debe aparecer "activated and is running"
4. Activa el modo avión y recarga: todo funciona

También puedes **instalarla** (botón "Instalar app" en Chrome/Edge, o
"Compartir → Añadir a pantalla de inicio" en iOS).

## Hook de Git (Husky)

Cada `git commit` ejecuta automáticamente:

```bash
npm run lint && npm run build
```

Si el lint o el build fallan, **el commit se aborta**. El hook vive en
`.husky/pre-commit` y se instala solo al correr `npm install` (script
`prepare`). `dist/` está ignorado, así que el build del hook no ensucia el repo.

Para saltarlo de forma excepcional (no recomendado): `git commit --no-verify`.

## Despliegue en Vercel

El repo ya incluye `vercel.json`, así que el despliegue es automático:

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Vercel detecta Vite y aplica la configuración del proyecto (build, salida
   `dist` y rewrite SPA para que `/estilo/1A` no devuelva 404).
3. Cada push a `main` despliega producción; cada PR genera un **Preview
   Deployment** con su propia URL.
4. `npm run check` corre antes de cada build: tipos y lint deben pasar para
   publicar.

No hay variables de entorno ni funciones serverless: es 100 % estático.

## Estructura

```
src/
├── data/beers.json        # catálogo de estilos BJCP (añade estilos aquí)
├── data/beers.ts          # acceso tipado + búsqueda/filtrado
├── data/americanPaleAle.ts# objeto demo del nuevo modelo BeerStyle (18B)
├── types/beer.ts          # modelo actual (Beer, PerfilSensorial, Maridaje…)
├── types/beerStyle.ts     # nuevo modelo (BeerStyle, SensoryProfile, FoodPairing…)
├── lib/srm.ts             # escala SRM → colores CSS
├── lib/pairing.ts         # configuración visual de categorías de maridaje
├── hooks/useBeers.ts      # estado del buscador
├── components/            # BeerCard, BeerGlass, RadarPerfil, VitalesBar…
├── components/food/       # SuggestedDishes (carrusel), SensoryTabs
├── components/beerstyle/  # ficha showcase: BeerStyleDetail, PairingTabs…
└── pages/                 # Home, BeerDetail (food-first) y BeerStylePage
```

## Añadir un estilo

Edita `src/data/beers.json` con la forma `Beer` de `src/types/beer.ts`: rangos
vitales `[mín, máx]`, radar 0–5 y los platos sugeridos con su categoría,
afinidad y principio de maridaje. Aparece automáticamente en el catálogo, el
buscador y la navegación.

## Reglas para asistentes de IA

El proyecto incluye [`AGENTS.md`](./AGENTS.md): cualquier IA que trabaje aquí
debe aplicar el principio **KISS** (soluciones simples, sin abstracciones
prematuras) y verificar con `npm run check` antes de dar una tarea por
terminada.

## Licencia

[MIT](./LICENSE) © 2026 **Miguelangel Rendon** · [silvermiguel96@gmail.com](mailto:silvermiguel96@gmail.com)
