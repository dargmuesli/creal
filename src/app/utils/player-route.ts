export const MIXES_PATH = '/mixes'

export const decodeUriComponentSafe = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const joinPathSegments = (...parts: (string | undefined)[]) =>
  parts.filter(Boolean).join('/')

const pathToSegments = (playlistPath?: string) =>
  playlistPath ? playlistPath.split('/').filter(Boolean) : []

const buildMixPath = (segments: string[], trailingSlash: boolean) => {
  const encoded = segments.map((segment) => encodeURIComponent(segment))
  const path = encoded.length
    ? `${MIXES_PATH}/${encoded.join('/')}`
    : MIXES_PATH

  return trailingSlash ? `${path}/` : path
}

// A trailing slash denotes a collection (browsable S3 prefix), mirroring
// how S3 itself distinguishes a "folder" prefix from an object key.
export const getCollectionPath = (playlistPath?: string) =>
  buildMixPath(pathToSegments(playlistPath), true)

// No trailing slash denotes a track (a concrete S3 object key).
export const getTrackPath = (playlistPath: string | undefined, track: string) =>
  buildMixPath([...pathToSegments(playlistPath), track], false)

// Inverse of getTrackPath: splits a stored track path (which always starts
// with MIXES_PATH) into the playlist prefix and the decoded track file name.
export const parseTrackPath = (trackPath: string) => {
  const segments = trackPath.split('/').filter(Boolean)
  const rest = segments.slice(1)
  const fileName = decodeUriComponentSafe(rest[rest.length - 1] ?? '')
  const playlistPath =
    rest.slice(0, -1).map(decodeUriComponentSafe).join('/') || undefined

  return { playlistPath, fileName }
}

// True when a route deep-links a track: a mixes route (optionally behind the
// non-default locale's prefix segment) with segments and no trailing slash.
export const isMixesTrackRoute = (path: string) => {
  const segments = path.split('/').filter(Boolean)
  const mixesIndex =
    segments[0] === 'mixes' ? 0 : segments[1] === 'mixes' ? 1 : -1

  return (
    mixesIndex > -1 && segments.length > mixesIndex + 1 && !path.endsWith('/')
  )
}

export const getPlaylistPrefix = (playlistPath?: string) =>
  playlistPath ? `${playlistPath}/` : ''
