import { PlaylistItem } from '~/types/player'

export async function getSignedUrl({
  playlistItem,
  playlistPath,
}: {
  playlistItem: PlaylistItem
  playlistPath?: string
}) {
  const key =
    PLAYER_PREFIX +
    (playlistPath ? playlistPath + '/' : '') +
    playlistItem.fileName +
    '.' +
    playlistItem.fileExtension
  const {
    data: { value },
  } = await useFetch('/api/player/signed-url', {
    params: { key },
  })
  return value
}
