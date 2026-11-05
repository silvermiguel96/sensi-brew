import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Beer, Moon, Sun, WifiOff } from 'lucide-react'
import { InstallToast } from './components/InstallToast'
import { readStorage, writeStorage } from './lib/storage'
import type { Guide } from './types/beer'
import { Home } from './pages/Home'

const GUIDE_KEY = 'sensibrew-guide'
const THEME_KEY = 'sensibrew-theme'

// Recharts is only needed on the detail view => separate chunk.
const BeerDetail = lazy(() =>
  import('./pages/BeerDetail').then((m) => ({ default: m.BeerDetail })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
)

/** Loading skeleton for lazy chunks (feels faster than a lone spinner). */
function PageFallback() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando contenido"
      className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-6"
    >
      <span className="sr-only">Cargando…</span>
      <div className="glass-panel animate-pulse rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="h-44 w-28 shrink-0 rounded-xl bg-sb-fill sm:h-72 sm:w-44" />
          <div className="w-full space-y-3">
            <div className="h-4 w-28 rounded bg-sb-fill" />
            <div className="h-9 w-3/4 rounded bg-sb-fill-strong" />
            <div className="h-4 w-40 rounded bg-sb-fill" />
            <div className="h-6 w-32 rounded-full bg-sb-fill" />
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-panel animate-pulse rounded-2xl p-4">
            <div className="space-y-2.5">
              <div className="h-3 w-20 rounded bg-sb-fill" />
              <div className="h-5 w-3/4 rounded bg-sb-fill-strong" />
              <div className="h-3 w-1/2 rounded bg-sb-fill" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Page({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

function Header({
  guide,
  onSelectGuide,
}: {
  guide: Guide
  onSelectGuide: (guide: Guide) => void
}) {
  const [offline, setOffline] = useState(!navigator.onLine)
  const [theme, setTheme] = useState<string>(
    () => document.documentElement.getAttribute('data-theme') ?? 'dark',
  )

  useEffect(() => {
    const handleOnline = () => setOffline(false)
    const handleOffline = () => setOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    writeStorage(THEME_KEY, next)
    setTheme(next)
  }

  const light = theme === 'light'

  return (
    <header className="sticky top-0 z-50 border-b border-sb-border bg-sb-bg/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-amber-500 text-zinc-950 shadow-[0_0_24px_rgba(251,191,36,0.25)]">
            <Beer className="h-4.5 w-4.5" aria-hidden />
          </span>
          <span className="font-serif text-base font-bold tracking-tight text-sb-title">
            Sensi<span className="text-sb-accent">Brew</span>
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          {offline && (
            <span
              role="status"
              aria-label="Modo offline activo"
              className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-sb-accent"
            >
              <WifiOff className="h-3 w-3" />
              <span>Offline</span>
            </span>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={light ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            aria-pressed={light}
            className="grid h-8 w-8 place-items-center rounded-full border border-sb-border text-sb-muted transition-colors hover:bg-sb-fill hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            {light ? (
              <Moon className="h-4 w-4" aria-hidden />
            ) : (
              <Sun className="h-4 w-4" aria-hidden />
            )}
          </button>
          <div
            role="group"
            aria-label="Guía BJCP del catálogo"
            className="flex items-center rounded-full border border-sb-border p-0.5"
          >
            {(['2015', '2021'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onSelectGuide(g)}
                aria-pressed={guide === g}
                aria-label={`Ver catálogo BJCP ${g}`}
                className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-widest transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none ${guide === g
                  ? 'bg-amber-500 text-zinc-950 shadow-[0_0_24px_rgba(251,191,36,0.25)]'
                  : 'text-sb-muted hover:bg-sb-fill hover:text-sb-text'
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

function AnimatedRoutes({
  guide,
  setGuide,
}: {
  guide: Guide
  setGuide: (guide: Guide) => void
}) {
  const location = useLocation()

  // On view change: scroll to top and move focus to the content
  // so screen readers announce the new view.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('content')?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home guide={guide} setGuide={setGuide} />} />
        <Route path="/estilo/:id" element={<Page><BeerDetail guide={guide} setGuide={setGuide} /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [guide, setGuide] = useState<Guide>(() => {
    const saved = readStorage(GUIDE_KEY)
    return saved === '2015' || saved === '2021' ? saved : '2021'
  })

  const changeGuide = (next: Guide) => {
    setGuide(next)
    writeStorage(GUIDE_KEY, next)
  }

  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-sb-bg">
        {/* Keyboard skip link: visible only on focus */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-zinc-950 focus:outline-none"
        >
          Saltar al contenido
        </a>
        {/* Soft cellar-like ambient light */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(100%_60%_at_50%_0%,rgba(251,191,36,0.06),transparent_70%)]"
        />
        <div className="relative">
          <Header guide={guide} onSelectGuide={changeGuide} />
          <main id="content" tabIndex={-1} className="focus:outline-none">
            <AnimatedRoutes guide={guide} setGuide={changeGuide} />
          </main>
          <footer className="border-t border-sb-border py-8 text-center text-xs text-sb-muted">
            SensiBrew · Datos sensoriales basados en las guías BJCP 2015 y 2021 ·
            Hecho para catadores
          </footer>
          {/* Discreet install invitation outside Home */}
          <InstallToast />
        </div>
      </div>
    </BrowserRouter>
  )
}
