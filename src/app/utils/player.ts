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

  // $fetch, not useFetch: this runs from event handlers and after prior
  // awaits, never during the synchronous setup phase useFetch requires.
  return await $fetch('/api/player/signed-url', {
    params: { key },
  })
}
