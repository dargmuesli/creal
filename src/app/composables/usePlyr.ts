export const usePlyr = () => {
  const router = useRouter()
  const mixLocalePath = useMixLocalePath()
  const store = useStore()
  const alertError = useAlertError()

  return {
    play: async (
      playlistItem: PlaylistItem,
      playlistPath?: string,
      skipRoute = false,
    ) => {
      store.playerData.isVisible = true

      // Get meta.
      const key =
        PLAYER_PREFIX +
        getPlaylistPrefix(playlistPath) +
        playlistItem.fileName +
        '.json'

      const signedUrl = await getSignedUrl({ playlistItem, playlistPath })

      if (!signedUrl) return alertError('Could not get signed url!')

      if (!skipRoute) {
        router.replace({
          path: mixLocalePath(
            getTrackPath(playlistPath, playlistItem.fileName),
          ),
        })
      }

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
