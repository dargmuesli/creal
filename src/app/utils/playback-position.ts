// Persists the playback position of the current track so a page reload can
// resume where the user left off. Client-only: every access is guarded so
// nothing touches storage during server rendering.
const STORAGE_KEY = 'creal:playback-position'

export interface PlaybackPosition {
  trackKey: string
  time: number
}

const readStored = (): PlaybackPosition | undefined => {
  if (!import.meta.client) return

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    return raw ? (JSON.parse(raw) as PlaybackPosition) : undefined
  } catch {
    // Corrupt or unreadable storage is treated as "no saved position".
    return undefined
  }
}

const writeStored = (value: PlaybackPosition): void => {
  if (!import.meta.client) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private browsing, quota); dropping the
    // position is acceptable, so ignore.
  }
}

const removeStored = (): void => {
  if (!import.meta.client) return

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore, as above
  }
}

// Returns the saved position for `trackKey`, or undefined when there is none.
export const readPlaybackPosition = (trackKey: string): number | undefined => {
  const stored = readStored()

  if (!stored || stored.trackKey !== trackKey) return

  return stored.time
}

// Returns the full saved playback state (which track, and where in it), or
// undefined when nothing is saved. Used to restore the playback context
// after a reload on a page that is not the track's own URL.
export const readSavedPlayback = (): PlaybackPosition | undefined =>
  readStored()

export const writePlaybackPosition = (trackKey: string, time: number): void => {
  if (!Number.isFinite(time) || time < 0) return

  writeStored({ trackKey, time })
}

export const clearPlaybackPosition = (): void => {
  removeStored()
}
