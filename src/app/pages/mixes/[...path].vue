<template>
  <div class="container mx-auto">
    <section>
      <VioLayoutBreadcrumbs :suffixes="breadcrumbSuffixes">
        {{ title }}
      </VioLayoutBreadcrumbs>
      <div v-if="isLoading" class="text-center">
        <VioLoaderIndicatorSpinner class="m-auto h-32 w-32" />
        {{ t('globalStatusLoading') }}
      </div>
      <div v-else-if="store.playerData.currentPlaylist">
        <ul
          v-if="store.playerData.currentPlaylist.collections.length"
          class="flex flex-col flex-wrap items-center gap-4 md:flex-row"
        >
          <li
            v-for="collection in store.playerData.currentPlaylist.collections"
            :key="collection.name"
          >
            <VioLink
              class="block"
              :is-colored="false"
              :title="collection.name"
              :to="getPlaylistLink(collection.name)"
            >
              <CrPlayerPlaylist class="h-full" :playlist="collection" />
            </VioLink>
          </li>
        </ul>
        <ul
          v-if="store.playerData.currentPlaylist.items.length"
          class="flex flex-col gap-4"
        >
          <CrPlayerPlaylistItem
            v-for="playlistItem of store.playerData.currentPlaylist.items"
            :key="playlistItem.fileName"
            :class="{
              'text-yellow-500':
                resolvedPlaylistPath &&
                store.playerData.currentPlaylist &&
                store.playerData.currentTrack &&
                resolvedPlaylistPath ===
                  store.playerData.currentPlaylist.name &&
                playlistItem.fileName ===
                  store.playerData.currentTrack.fileName,
            }"
            :playlist-item="playlistItem"
            @download="download(playlistItem)"
            @play="play(playlistItem, resolvedPlaylistPath)"
          />
        </ul>
        <div
          v-if="
            !store.playerData.currentPlaylist.collections.length &&
            !store.playerData.currentPlaylist.items.length
          "
          class="text-center"
        >
          {{ t('itemsNone') }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const alertError = useAlertError()
const { play } = usePlyr()

// data
const isLoading = ref(false)
const resolvedPlaylistPath = ref<string>()
const resolvedTrack = ref<string>()
const title = t('titlePage')

// methods
const fetchPlaylistData = async (prefix?: string) => {
  let continuationToken: string | undefined
  const playlistDataFetch = {
    name: 'root',
    collections: [],
    items: [],
    isCoverAvailable: false,
  } as Playlist

  do {
    const { data } = await useFetch('/api/player/playlists', {
      params: {
        ...(continuationToken && {
          'continuation-token': continuationToken,
        }),
        ...(prefix && {
          prefix,
        }),
      },
    })

    mergeByKey(playlistDataFetch, data.value?.playlistData, 'name')
    continuationToken = data.value?.nextContinuationToken
  } while (continuationToken)

  return playlistDataFetch
}
let initRequestId = 0

const init = async () => {
  const requestId = ++initRequestId
  isLoading.value = true

  const pathParts = routePathParts.value
  let playlistPath = pathParts.join('/') || undefined
  let track: string | undefined
  let playlistDataFetch = await fetchPlaylistData(playlistPath)

  if (
    !playlistDataFetch.collections.length &&
    !playlistDataFetch.items.length
  ) {
    // The path may point at a track rather than a (possibly empty)
    // playlist. Confirm against the parent playlist's actual items
    // instead of guessing from the empty result alone.
    const candidateTrack = pathParts[pathParts.length - 1]
    const candidateParentPath = getPathWithoutLastPart(pathParts) || undefined

    if (candidateTrack) {
      const parentDataFetch = await fetchPlaylistData(candidateParentPath)

      if (
        parentDataFetch.items.some(
          (playlistItem) => playlistItem.fileName === candidateTrack,
        )
      ) {
        track = candidateTrack
        playlistPath = candidateParentPath
        playlistDataFetch = parentDataFetch
      }
    }
  }

  if (requestId !== initRequestId) return

  resolvedPlaylistPath.value = playlistPath
  resolvedTrack.value = track
  store.playerData.currentPlaylist = playlistDataFetch
  store.playerData.currentPlaylist.name =
    playlistPath ?? store.playerData.currentPlaylist.name

  // Try to select and play track as indicated by route path.
  if (store.playerData.isPaused && store.playerData.currentPlaylist && track) {
    for (const playlistItem of store.playerData.currentPlaylist.items) {
      if (playlistItem.fileName === track) {
        play(playlistItem, playlistPath)
        break
      }
    }
  }

  isLoading.value = false
}
const titleHead = () =>
  store.playerData.currentTrack?.fileName && !store.playerData.isPaused
    ? store.playerData.currentTrack.fileName
    : title
const getPlaylistLink = (name: string) => {
  const playlistPath = [resolvedPlaylistPath.value, name]
    .filter(Boolean)
    .join('/')

  return localePath(getMixPath(playlistPath))
}
const download = async (playlistItem: PlaylistItem) => {
  const link = document.createElement('a')
  const signedUrl = await getSignedUrl({
    playlistItem,
    playlistPath: resolvedPlaylistPath.value,
  })

  if (!signedUrl) return alertError('Could not get signed url!')

  link.setAttribute('href', signedUrl)
  const signedUrlWithoutQuery = signedUrl.split('?')[0] ?? signedUrl
  const signedUrlPathPart = signedUrlWithoutQuery?.split('/').at(-1)
  const fallbackFileName = `${playlistItem.fileName}.${playlistItem.fileExtension}`
  const downloadFileName = signedUrlPathPart
    ? decodeUriComponentSafe(signedUrlPathPart)
    : fallbackFileName

  link.setAttribute('download', downloadFileName)
  link.click()
}
const getPathWithoutLastPart = (pathParts: string[]) =>
  pathParts.slice(0, -1).join('/')

// computations
const routePathParts = computed(() => {
  if (Array.isArray(route.params.path)) return route.params.path

  if (typeof route.params.path === 'string') return [route.params.path]

  return []
})
const breadcrumbSuffixes = computed(() => {
  if (!resolvedPlaylistPath.value) return

  const breadcrumbSuffixes = []
  const playlistPathParts = resolvedPlaylistPath.value.split('/')

  for (const [index, playlistPathPart] of playlistPathParts.entries()) {
    const playlistPath = playlistPathParts.slice(0, index + 1).join('/')

    breadcrumbSuffixes.push({
      name: playlistPathPart,
      to: localePath(
        getMixPath(
          playlistPath,
          index === playlistPathParts.length - 1
            ? resolvedTrack.value
            : undefined,
        ),
      ),
    })
  }

  return breadcrumbSuffixes
})

// lifecycle

const isOnlyTrackChanged = (pathParts: string[]) => {
  if (!store.playerData.currentPlaylist) return false

  const trackCandidate = pathParts[pathParts.length - 1]

  if (!trackCandidate) return false

  const candidateParentPath = getPathWithoutLastPart(pathParts) || undefined

  if (candidateParentPath !== resolvedPlaylistPath.value) return false

  return store.playerData.currentPlaylist.items.some(
    (playlistItem) => playlistItem.fileName === trackCandidate,
  )
}

watch(
  () => route.params.path,
  async () => {
    const pathParts = routePathParts.value
    const joinedPath = pathParts.join('/') || undefined

    // Keep breadcrumb state in sync even when we can skip a refetch.
    if (joinedPath === resolvedPlaylistPath.value) {
      resolvedTrack.value = undefined
      return
    }

    if (isOnlyTrackChanged(pathParts)) {
      resolvedTrack.value = pathParts[pathParts.length - 1]
      return
    }

    await init()
  },
)

// initialization
await init()
useCrealHeadDefault({
  description: t('description'),
  title: titleHead(),
})
</script>

<i18n lang="yaml">
de:
  description: Mixe von DJ cReal anhören.
  itemsNone: Keine Elemente gefunden.
  titlePage: Mixe
en:
  description: Listen to mixes by DJ cReal.
  itemsNone: No items found.
  titlePage: Mixes
</i18n>
