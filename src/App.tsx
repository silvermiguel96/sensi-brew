import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Beer } from 'lucide-react'
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
    <div className="mx-auto flex h-[60vh] w-full max-w-5xl items-center justify-center px-4">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-600 border-t-amber-400" />
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-amber-300 to-orange-500 text-slate-900 shadow-[0_0_14px_rgba(251,191,36,0.35)]">
            <Beer className="h-4.5 w-4.5" />
          </span>
          <span className="text-base font-black tracking-tight text-slate-50">
            Sensi<span className="text-amber-400">Brew</span>
          </span>
        </Link>
        <span className="text-[11px] font-medium tracking-wide text-slate-500">
          BJCP 2021
        </span>
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
      <div className="min-h-dvh bg-slate-900">
        {/* Viñeta ambiental tipo sala de cata */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(251,191,36,0.07),transparent_70%)]"
        />
        <div className="relative">
          <Header />
          <main>
            <AnimatedRoutes />
          </main>
          <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
            SensiBrew · Datos sensoriales basados en la guía BJCP 2021 · Hecho para
            catadores
          </footer>
        </div>
      </div>
    </BrowserRouter>
  )
}
