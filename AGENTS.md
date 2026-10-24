# SensiBrew — Instrucciones del proyecto

## Principio rector: KISS (Keep It Simple, Stupid)

- Aplica siempre **la solución más simple que funcione**. Si dudas entre dos
  caminos, elige el que tenga menos piezas.
- **Sin abstracciones prematuras**: no crees capas, servicios, contextos,
  hooks genéricos ni helpers "por si acaso". Primero el código directo; se
  extrae cuando duela repetirlo tres veces.
- **Un solo modo de hacer cada cosa**: reutiliza lo que ya existe en el
  proyecto antes de introducir un patrón nuevo.
- **Dependencias nuevas solo si eliminan complejidad real.** Justifícalas en
  la respuesta. Si se resuelve con CSS, datos estáticos o 20 líneas de TS, no
  instales nada.
- Prefiere **datos estáticos y CSS generado** antes que base de datos, APIs o
  assets de imagen.
- Cambios pequeños y revisables: no refactorices lo que no te pidieron.

## Contexto real del proyecto (¡no es Next.js!)

- **Vite 8 + React 19 + TypeScript estricto** (SPA, sin SSR).
- **Tailwind CSS v4** (`@import 'tailwindcss'` + `@theme`, sin `tailwind.config`).
- **vite-plugin-pwa** (Workbox precache, offline-first), **Recharts**,
  **Framer Motion**, **Lucide React**, **react-router-dom**.
- **Sin backend, sin base de datos, sin Zod.** Los datos viven en JSON
  estáticos dentro del bundle.
- Catálogo: `src/data/beers.json` (modelo `Beer`).
  Ficha showcase: `src/data/americanPaleAle.ts` (modelo `BeerStyle`).

## Convenciones

- Tipos e interfaces en `src/types/`; componentes funcionales nombrados.
- UI, comentarios y JSDoc **en español**.
- Paleta: `slate`/`zinc` de fondo + acentos `amber`/`yellow`. Nada de `gray`/`stone`.
- Accesibilidad obligatoria en interacción: roles ARIA en tabs, teclado,
  `focus-visible`, y respetar `prefers-reduced-motion`.
- Animaciones con Framer Motion; nunca animar los `<path>` internos de Recharts.
- Imágenes: generar con CSS/SVG/emoji. No añadir assets pesados sin pedirlo.

## Git (regla dura: solo lectura)

- **NUNCA ejecutes `git commit`, `git push`** ni ningún comando que cree
  historial o publique el repo (`gh repo create`, `gh release`, deploy por
  CLI). El historial y el push los hace **siempre la persona**, aunque te lo
  pida en el momento: recuérdale los comandos y detente ahí.
- Tampoco hagas `git add` ni modifiques el índice: deja los cambios en el
  working tree para que la persona los revise.
- Solo puedes usar git en **modo lectura** cuando te lo pidan: `status`,
  `diff`, `log`, `show`, `remote -v`.
- Nunca reescribas historia (`push --force`, `reset --hard`, `filter-branch`)
  ni toques credenciales, tokens o claves SSH.

## Verificación (después de cada cambio)

```bash
npm run check   # TypeScript + oxlint
npm run build   # build de producción + service worker
```

El hook de **Husky** (`.husky/pre-commit`) ejecuta `npm run lint && npm run build`
automáticamente antes de cada commit: si falla, el commit se aborta. No lo
desactives con `--no-verify` salvo causa justificada.

No des una tarea por terminada si `check` o `build` fallan.

## Fuera de alcance (salvo petición explícita)

Tests automatizados, Prettier, backend/DB, migración de los dos modelos de
datos, y cualquier librería de UI/estado adicional.
