export const getSignedUrl = async ({
  playlistItem,
  playlistPath,
}: {
  playlistItem: PlaylistItem
  playlistPath?: string
}) => {
  const key =
    PLAYER_PREFIX +
    getPlaylistPrefix(playlistPath) +
    playlistItem.fileName +
    '.' +
    playlistItem.fileExtension

  return await $fetch('/api/player/signed-url', {
    query: { key },
  })
}

export const getCoverSignedUrl = async ({
  cover,
  playlistPath,
}: {
  cover: Cover
  playlistPath?: string
}) => {
  const key =
    PLAYER_PREFIX +
    getPlaylistPrefix(playlistPath) +
    cover.name +
    '.' +
    cover.fileExtension

  return await $fetch('/api/player/signed-url', {
    query: { key },
  })
}

// Display label for a track: drops the "cReal - " prefix and reorders the
// remaining " - " segments so the mix name comes first
// ("2020-05 - cReal - Trap Mix" -> "Trap Mix · 2020-05").
export const formatTrackLabel = (fileName: string) =>
  fileName
    .replace(/cReal - /, '')
    .split(' - ')
    .reverse()
    .join(' · ')
