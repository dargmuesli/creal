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

const joinMixPath = (segments: string[]) =>
  segments.length
    ? `${MIXES_PATH}/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`
    : MIXES_PATH

export const normalizePlaylistPath = (playlistPath?: string) =>
  playlistPath && playlistPath !== 'root' ? playlistPath : undefined

export const getMixPath = (playlistPath?: string, track?: string) => {
  const normalizedPlaylistPath = normalizePlaylistPath(playlistPath)
  const segments = [
    ...(normalizedPlaylistPath
      ? normalizedPlaylistPath.split('/').filter(Boolean)
      : []),
    ...(track ? [track] : []),
  ]

  return joinMixPath(segments)
}

export const getPlaylistPrefix = (playlistPath?: string) => {
  const normalizedPlaylistPath = normalizePlaylistPath(playlistPath)

  return normalizedPlaylistPath ? `${normalizedPlaylistPath}/` : ''
}
