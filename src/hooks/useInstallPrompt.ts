import { useSyncExternalStore } from 'react'

/** Evento `beforeinstallprompt` capturado por la PWA. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Clave de "pospuesto" en localStorage y su duración (7 días). */
const CLAVE_POSPUESTO = 'sensibrew-install-pospuesto'
const DURACION_POSPUESTO = 7 * 24 * 60 * 60 * 1000

type Estado = {
  evento: BeforeInstallPromptEvent | null
  instalada: boolean
  pospuesto: boolean
}

/** ¿El usuario pospuso la invitación hace menos de 7 días? */
function pospuestoGuardado(): boolean {
  try {
    const ts = Number(localStorage.getItem(CLAVE_POSPUESTO))
    return Number.isFinite(ts) && ts > 0 && Date.now() - ts < DURACION_POSPUESTO
  } catch {
    return false
  }
}

/** ¿Es un iPhone/iPad? Safari no dispara `beforeinstallprompt`. */
function esDispositivoIOS(): boolean {
  const { userAgent, platform, maxTouchPoints } = navigator
  // iPadOS 13+ se identifica como Mac pero con pantalla táctil
  return (
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  )
}

const nav = navigator as Navigator & { standalone?: boolean }

/** Una sola fuente: el banner y el toast leen lo mismo. */
let estado: Estado = {
  evento: null,
  instalada:
    nav.standalone === true || matchMedia('(display-mode: standalone)').matches,
  pospuesto: pospuestoGuardado(),
}

const oyentes = new Set<() => void>()

function publicar(parcial: Partial<Estado>) {
  estado = { ...estado, ...parcial }
  oyentes.forEach((fn) => fn())
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  publicar({ evento: e as BeforeInstallPromptEvent })
})

window.addEventListener('appinstalled', () => {
  publicar({ instalada: true, evento: null })
})

function suscribir(fn: () => void) {
  oyentes.add(fn)
  return () => {
    oyentes.delete(fn)
  }
}

async function instalar() {
  const evento = estado.evento
  if (!evento) return
  await evento.prompt()
  await evento.userChoice
  publicar({ evento: null })
}

/** "Ahora no": no volver a preguntar durante 7 días. */
function posponer() {
  try {
    localStorage.setItem(CLAVE_POSPUESTO, String(Date.now()))
  } catch {
    // Modo privado: el pospuesto dura solo en esta visita
  }
  publicar({ pospuesto: true })
}

/**
 * Detecta si la app puede instalarse y expone el estado de la invitación.
 *
 * - `puedeInstalar`: Chrome/Edge/Android emiten `beforeinstallprompt`.
 * - `esIOS`: Safari en iPhone/iPad no lo emite, así que hay que guiar al
 *   usuario a "Compartir → Añadir a pantalla de inicio".
 */
export function useInstallPrompt() {
  const { evento, instalada, pospuesto } = useSyncExternalStore(
    suscribir,
    () => estado,
    () => estado,
  )
  const ios = esDispositivoIOS()

  return {
    disponible: !instalada && !pospuesto && (evento !== null || ios),
    puedeInstalar: evento !== null,
    esIOS: ios,
    instalar,
    posponer,
  }
}
