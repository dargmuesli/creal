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
              :is-colored="false"
              class="block"
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
                selectedPlaylistPath &&
                store.playerData.currentPlaylist &&
                store.playerData.currentTrack &&
                selectedPlaylistPath ===
                  store.playerData.currentPlaylist.name &&
                playlistItem.fileName ===
                  store.playerData.currentTrack.fileName,
            }"
            :playlist-item="playlistItem"
            @download="download(playlistItem)"
            @play="play(playlistItem, selectedPlaylistPath)"
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
import { getMixPath } from '~/utils/player-route'

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
const init = async () => {
  isLoading.value = true

  const pathParts = routePathParts.value
  let playlistPath = pathParts.join('/') || undefined
  let track: string | undefined
  let playlistDataFetch = await fetchPlaylistData(playlistPath)

  if (
    pathParts.length > 1 &&
    !playlistDataFetch.collections.length &&
    !playlistDataFetch.items.length
  ) {
    track = pathParts[pathParts.length - 1]
    playlistPath = pathParts.slice(0, -1).join('/') || undefined
    playlistDataFetch = await fetchPlaylistData(playlistPath)
  }

  resolvedPlaylistPath.value = playlistPath
  resolvedTrack.value = track
  store.playerData.currentPlaylist = playlistDataFetch
  store.playerData.currentPlaylist.name = playlistPath
    ? decodeURIComponent(playlistPath)
    : store.playerData.currentPlaylist.name

  // Try to select and play track as indicated by route path.
  if (
    store.playerData.isPaused &&
    store.playerData.currentPlaylist &&
    playlistPath &&
    track
  ) {
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
    playlistPath: selectedPlaylistPath.value,
  })

  if (!signedUrl) return alertError('Could not get signed url!')

  link.setAttribute('href', signedUrl)
  link.setAttribute('download', '123.mp3') // This value is never shown to the user in current browser implementations.
  link.click()
}

// computations
const routePathParts = computed(() => {
  if (Array.isArray(route.params.path)) return route.params.path

  if (typeof route.params.path === 'string') return [route.params.path]

  return []
})
const selectedPlaylistPath = computed(() => resolvedPlaylistPath.value)
const breadcrumbSuffixes = computed(() => {
  if (!selectedPlaylistPath.value) return

  const breadcrumbSuffixes = []
  const playlistPathParts = selectedPlaylistPath.value.split('/')

  for (const [index, playlistPathPart] of playlistPathParts.entries()) {
    let playlistPath = ''

    for (let i = 0; i <= index; i++) {
      if (i !== 0) {
        playlistPath += '/'
      }

      playlistPath += playlistPathParts[i]
    }

    breadcrumbSuffixes.push({
      name: decodeURIComponent(playlistPathPart),
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
watch(
  () => route.params.path,
  async () => {
    const pathParts = routePathParts.value
    const joinedPath = pathParts.join('/')
    const trackCandidate = pathParts[pathParts.length - 1]
    const isOnlyTrackUpdated =
      !!resolvedPlaylistPath.value &&
      pathParts.slice(0, -1).join('/') === resolvedPlaylistPath.value &&
      !!trackCandidate &&
      !!store.playerData.currentPlaylist?.items.some(
        (playlistItem) => playlistItem.fileName === trackCandidate,
      )

    if (joinedPath === resolvedPlaylistPath.value || isOnlyTrackUpdated) return

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
