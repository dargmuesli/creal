export const usePlayer = () => {
  const router = useRouter()
  const route = useRoute()
  const localePath = useLocalePath()
  const store = useStore()
  const alertError = useAlertError()
  const { copy: copyText } = useCopy()

  const play = async (
    playlistItem: PlaylistItem,
    playlistPath?: string,
    skipRoute = false,
    playlist?: Playlist,
  ) => {
    store.playerData.isVisible = true

    // The playback context (what the sidebar queue shows) is the playlist
    // the track comes from. play() is its only writer, so navigating to a
    // different page never changes what the player displays.
    if (playlist) {
      store.playerData.currentPlaylist = playlist
      store.playerData.currentPlaylistPath = playlistPath
    }

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
        path: localePath({
          path: getTrackPath(playlistPath, playlistItem.fileName),
        }),
      })
    }

    store.playerData.currentTrack = {
      ...playlistItem,
      meta: playlistItem.isMetaAvailable
        ? JSON.parse(
            await $fetch('/api/player/get-object', {
              query: { key },
            }),
          )
        : undefined,
    }
    store.playerData.sourceUrl = signedUrl
  }
  const download = async (
    playlistItem: PlaylistItem,
    playlistPath?: string,
  ) => {
    const link = document.createElement('a')
    const signedUrl = await getSignedUrl({ playlistItem, playlistPath })

    if (!signedUrl) return alertError('Could not get signed url!')

    link.setAttribute('href', signedUrl)
    const signedUrlWithoutQuery = signedUrl.split('?')[0] ?? signedUrl
    const signedUrlPathPart = signedUrlWithoutQuery.split('/').at(-1)
    const fallbackFileName = `${playlistItem.fileName}.${playlistItem.fileExtension}`
    const downloadFileName = signedUrlPathPart
      ? decodeUriComponentSafe(signedUrlPathPart)
      : fallbackFileName

    link.setAttribute('download', downloadFileName)
    link.click()
  }
  const share = async (playlistItem: PlaylistItem, playlistPath?: string) => {
    if (!window || !playlistItem.fileName) return

    await copyText(
      `${window.location.origin}${getTrackPath(
        playlistPath,
        playlistItem.fileName,
      )}`,
    )
  }
  // Re-creates the playback context after a reload on a page that is not the
  // track's own URL (a mixes track URL restores itself via the page's init).
  // Best-effort: a failure (e.g. the track was deleted) just leaves the
  // player idle. The restored player sits behind the autoplay CTA, and the
  // saved position is applied by CrPlayer once the source has metadata.
  const restore = async () => {
    const saved = readSavedPlayback()
    if (!saved) return

    if (isMixesTrackRoute(route.path)) return

    try {
      const { playlistPath, fileName } = parseTrackPath(saved.trackKey)
      const playlist = await fetchPlaylistData(playlistPath)
      const playlistItem = playlist.items.find(
        (item) => item.fileName === fileName,
      )

      if (!playlistItem) {
        clearPlaybackPosition()
        return
      }

      await play(playlistItem, playlistPath, true, playlist)
    } catch {
      // ignore: restoring is best-effort, a failure must not break the page
    }
  }

  return {
    download,
    play,
    restore,
    share,
  }
}
