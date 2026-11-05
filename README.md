# 🍺 SensiBrew

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PWA](https://img.shields.io/badge/PWA-offline--first-amber.svg)](https://web.dev/progressive-web-apps/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff.svg?logo=vite&logoColor=white)](https://vite.dev)

PWA **offline-first** para catadores y entusiastas de la cerveza, basada en las
**guías BJCP 2015 y 2021**. Perfiles sensoriales, estadísticas vitales y **maridajes
gastronómicos** con justificación química.

Sin base de datos: los catálogos viven en `src/data/beers-2021.json` y
`src/data/beers-2015.json` y se empaquetan
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
| `/estilo/:id`   | Ficha food-first del estilo en la guía activa (ej. `/estilo/18B`) |

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
├── data/beers-2021.json   # catálogo BJCP 2021 (añade estilos aquí)
├── data/beers-2015.json   # catálogo BJCP 2015
├── data/beers.ts          # acceso tipado + búsqueda/filtrado
├── types/beer.ts          # modelo único (Beer, SensoryProfile, Pairing…)
├── lib/srm.ts             # escala SRM → colores CSS
├── lib/pairing.ts         # configuración visual de categorías de platos
├── lib/storage.ts         # localStorage seguro (modo privado)
├── hooks/                 # useBeers, useInstallPrompt, usePageMeta
├── components/            # BeerCard, BeerGlass, SensoryRadar, VitalStats, SuggestedDishes…
└── pages/                 # Home, BeerDetail y NotFound
```

## Añadir un estilo

Edita el JSON de la guía con la forma `Beer` de `src/types/beer.ts`: rangos
vitales `[mín, máx]`, radar 0–5 y los platos sugeridos con su categoría,
afinidad y principio de maridaje. Aparece automáticamente en el catálogo, el
buscador y la navegación.

## Reglas para asistentes de IA

El proyecto incluye [`AGENTS.md`](./AGENTS.md): cualquier IA que trabaje aquí
debe aplicar el principio **KISS** (soluciones simples, sin abstracciones
prematuras), escribir el código en inglés (la UI sigue en español) y verificar
con `npm run check` y `npm run build` antes de dar una tarea por terminada.

## Licencia

[MIT](./LICENSE) © 2026 **Miguelangel Rendon** · [silvermiguel96@gmail.com](mailto:silvermiguel96@gmail.com)
