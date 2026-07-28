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
    params: { key },
  })
}
