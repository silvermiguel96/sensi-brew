import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Beer, WifiOff } from 'lucide-react'
import { Home } from './pages/Home'

// Recharts solo se necesita en la vista de detalle => chunk aparte.
const BeerDetail = lazy(() =>
  import('./pages/BeerDetail').then((m) => ({ default: m.BeerDetail })),
)
const BeerStylePage = lazy(() =>
  import('./pages/BeerStylePage').then((m) => ({ default: m.BeerStylePage })),
)

function PageFallback() {
  return (
    <div className="mx-auto flex h-[60vh] w-full max-w-6xl items-center justify-center px-4">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-800 border-t-amber-400" />
    </div>
  )
}

function Header() {
  const [offline, setOffline] = useState(!navigator.onLine)

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

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-amber-500 text-zinc-950 shadow-[0_0_40px_rgba(251,191,36,0.08)]">
            <Beer className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-black tracking-tight text-zinc-50">
            Sensi<span className="text-amber-400">Brew</span>
          </span>
        </Link>
        <div className="flex items-center gap-2.5">
          {offline && (
            <span
              role="status"
              aria-label="Modo offline activo"
              className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300"
            >
              <WifiOff className="h-3 w-3" />
              <span>Offline</span>
            </span>
          )}
          <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">
            BJCP 2021
          </span>
        </div>
      </div>
    </header>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  // Al cambiar de vista, volvemos al inicio de la página.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        {/* Nueva página de detalle (modelo BeerStyle) — showcase 18B */}
        <Route
          path="/estilo/18B"
          element={
            <Suspense fallback={<PageFallback />}>
              <BeerStylePage />
            </Suspense>
          }
        />
        <Route
          path="/estilo/:id"
          element={
            <Suspense fallback={<PageFallback />}>
              <BeerDetail />
            </Suspense>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-zinc-950">
        {/* Luz ambiental difusa tipo cava */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(100%_60%_at_50%_0%,rgba(251,191,36,0.06),transparent_70%)]"
        />
        <div className="relative">
          <Header />
          <main>
            <AnimatedRoutes />
          </main>
          <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-600">
            SensiBrew · Datos sensoriales basados en la guía BJCP 2021 · Hecho para
            catadores
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}
