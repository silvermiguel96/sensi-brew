import { useSyncExternalStore } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

/** `beforeinstallprompt` event captured by the PWA. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** localStorage key for "postponed" and its duration (7 days). */
const POSTPONED_KEY = 'sensibrew-install-postponed'
const POSTPONED_DURATION = 7 * 24 * 60 * 60 * 1000

type State = {
  event: BeforeInstallPromptEvent | null
  installed: boolean
  postponed: boolean
}

/** Did the user postpone the invitation less than 7 days ago? */
function isPostponed(): boolean {
  const ts = Number(readStorage(POSTPONED_KEY))
  return Number.isFinite(ts) && ts > 0 && Date.now() - ts < POSTPONED_DURATION
}

/** Is it an iPhone/iPad? Safari does not fire `beforeinstallprompt`. */
function isIOSDevice(): boolean {
  const { userAgent, platform, maxTouchPoints } = navigator
  // iPadOS 13+ reports itself as a Mac with a touch screen
  return (
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  )
}

const nav = navigator as Navigator & { standalone?: boolean }

/** Single source: the banner and the toast read the same state. */
let state: State = {
  event: null,
  installed:
    nav.standalone === true || matchMedia('(display-mode: standalone)').matches,
  postponed: isPostponed(),
}

const listeners = new Set<() => void>()

function publish(partial: Partial<State>) {
  state = { ...state, ...partial }
  listeners.forEach((fn) => fn())
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  publish({ event: e as BeforeInstallPromptEvent })
})

window.addEventListener('appinstalled', () => {
  publish({ installed: true, event: null })
})

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

async function install() {
  const event = state.event
  if (!event) return
  await event.prompt()
  await event.userChoice
  publish({ event: null })
}

/** "Not now": don't ask again for 7 days. */
function postpone() {
  writeStorage(POSTPONED_KEY, String(Date.now()))
  publish({ postponed: true })
}

/**
 * Detects whether the app can be installed and exposes the invitation state.
 *
 * - `canInstall`: Chrome/Edge/Android fire `beforeinstallprompt`.
 * - `isIOS`: Safari on iPhone/iPad does not, so the user is guided to
 *   "Share → Add to Home Screen".
 */
export function useInstallPrompt() {
  const { event, installed, postponed } = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  )
  const ios = isIOSDevice()

  return {
    available: !installed && !postponed && (event !== null || ios),
    canInstall: event !== null,
    isIOS: ios,
    install,
    postpone,
  }
}
