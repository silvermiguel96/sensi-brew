import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Beer, Moon, Sun, WifiOff } from 'lucide-react'
import { Home } from './pages/Home'
import { InstallToast } from './components/InstallToast'

// Recharts solo se necesita en la vista de detalle => chunk aparte.
const BeerDetail = lazy(() =>
  import('./pages/BeerDetail').then((m) => ({ default: m.BeerDetail })),
)
const BeerStylePage = lazy(() =>
  import('./pages/BeerStylePage').then((m) => ({ default: m.BeerStylePage })),
)
const NotFound = lazy(() =>
  import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
)

/** Skeleton de carga para los chunks lazy (mejor percepción que un spinner aislado). */
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

function Pagina({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>
}

function Header() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const [tema, setTema] = useState<string>(
    () => document.documentElement.getAttribute('data-tema') ?? 'oscuro',
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

  const alternarTema = () => {
    const siguiente = tema === 'claro' ? 'oscuro' : 'claro'
    document.documentElement.setAttribute('data-tema', siguiente)
    try {
      localStorage.setItem('sensibrew-tema', siguiente)
    } catch {
      // Modo privado: el tema dura solo en esta sesión
    }
    setTema(siguiente)
  }

  const claro = tema === 'claro'

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
            onClick={alternarTema}
            aria-label={claro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            aria-pressed={claro}
            className="grid h-8 w-8 place-items-center rounded-full border border-sb-border text-sb-muted transition-colors hover:bg-sb-fill hover:text-sb-text focus-visible:ring-2 focus-visible:ring-sb-focus focus-visible:outline-none"
          >
            {claro ? (
              <Moon className="h-4 w-4" aria-hidden />
            ) : (
              <Sun className="h-4 w-4" aria-hidden />
            )}
          </button>
          <span className="text-[11px] font-medium tracking-widest text-sb-muted uppercase">
            BJCP 2021
          </span>
        </div>
      </div>
    </header>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  // Al cambiar de vista: volver al inicio y mover el foco al contenido
  // para que los lectores de pantalla anuncien la nueva vista.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('contenido')?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        {/* Nueva página de detalle (modelo BeerStyle) — showcase 18B */}
        <Route path="/estilo/18B" element={<Pagina><BeerStylePage /></Pagina>} />
        <Route path="/estilo/:id" element={<Pagina><BeerDetail /></Pagina>} />
        <Route path="*" element={<Pagina><NotFound /></Pagina>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-sb-bg">
        {/* Enlace de salto para teclado: visible solo al recibir foco */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-zinc-950 focus:outline-none"
        >
          Saltar al contenido
        </a>
        {/* Luz ambiental difusa tipo cava */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(100%_60%_at_50%_0%,rgba(251,191,36,0.06),transparent_70%)]"
        />
        <div className="relative">
          <Header />
          <main id="contenido" tabIndex={-1} className="focus:outline-none">
            <AnimatedRoutes />
          </main>
          <footer className="border-t border-sb-border py-8 text-center text-xs text-sb-muted">
            SensiBrew · Datos sensoriales basados en la guía BJCP 2021 · Hecho para
            catadores
          </footer>
          {/* Invitación discreta a instalar fuera del Home */}
          <InstallToast />
        </div>
      </div>
    </BrowserRouter>
  )
}
