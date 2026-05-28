import { getMixPath, getPlaylistPrefix } from '~/utils/player-route'

export const usePlyr = () => {
  const router = useRouter()
  const store = useStore()
  const alertError = useAlertError()

  return {
    play: async (playlistItem: PlaylistItem, playlistPath?: string) => {
      store.playerData.isVisible = true

      router.replace({
        path: getMixPath(playlistPath, playlistItem.fileName),
      })

      // Get meta.
      const key =
        PLAYER_PREFIX +
        getPlaylistPrefix(playlistPath) +
        playlistItem.fileName +
        '.json'

      const signedUrl = await getSignedUrl({ playlistItem, playlistPath })

      if (!signedUrl) return alertError('Could not get signed url!')

      store.playerData.currentTrack = {
        ...playlistItem,
        meta: playlistItem.isMetaAvailable
          ? JSON.parse(
              // @ts-expect-error TODO: remove typecast when excessive stack depth is resolved
              await $fetch('/api/player/get-object', {
                params: { key },
              }),
            )
          : undefined,
      }
      store.playerData.sourceInfo = {
        type: 'audio',
        sources: [
          {
            src: signedUrl,
            type: 'audio/mp3',
          },
        ],
      }
    },
  }
}
