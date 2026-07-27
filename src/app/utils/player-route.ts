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

export const getPlaylistPrefix = (playlistPath?: string) =>
  playlistPath ? `${playlistPath}/` : ''
