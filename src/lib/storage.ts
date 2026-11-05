/** localStorage read that never throws (private mode, blocked storage). */
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/** localStorage write that never throws; the value then lasts only for this session. */
export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private mode: nothing to persist
  }
}
