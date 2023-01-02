import { useStore } from '~/store'
import { PlaylistItem } from '~/types/player'

export const usePlyr = () => {
  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const fireError = useFireError()

  return {
    play: async (playlistPath: string, playlistItem: PlaylistItem) => {
      store.playerData.isVisible = true

      // Set query parameter.
      const queryObject = JSON.parse(JSON.stringify(route.query))
      const queryObjectTrack = playlistItem.fileName

      // Conditionally update track query parameter.
      if (queryObject.track !== queryObjectTrack) {
        queryObject.track = queryObjectTrack

        router.replace({
          // path: route.path,
          query: queryObject,
        })
      }

      // Get meta.
      const key =
        PLAYER_PREFIX +
        (playlistPath ? playlistPath + '/' : '') +
        playlistItem.fileName +
        '.json'

      const signedUrl = await getSignedUrl({ playlistItem, playlistPath })

      if (!signedUrl)
        return fireError({ error: new Error('Could not get signed url!') })

      store.playerData.currentTrack = {
        ...playlistItem,
        meta: playlistItem.isMetaAvailable
          ? await $fetch('/api/player/get-object', {
              params: { key },
            })
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
