export const MIXES_PATH = '/mixes'

const joinMixPath = (segments: string[]) =>
  segments.length
    ? `${MIXES_PATH}/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`
    : MIXES_PATH

export const getMixPath = (playlistPath?: string, track?: string) => {
  const segments = [
    ...(playlistPath ? playlistPath.split('/').filter(Boolean) : []),
    ...(track ? [track] : []),
  ]

  return joinMixPath(segments)
}

export const getMixPathFromLegacyQuery = (playlist?: string, track?: string) =>
  getMixPath(playlist, track)
