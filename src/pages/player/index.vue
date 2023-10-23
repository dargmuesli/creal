<template>
  <div class="container mx-auto">
    <section>
      <VioLayoutBreadcrumbs :suffixes="breadcrumbSuffixes">
        {{ title }}
      </VioLayoutBreadcrumbs>
      <div class="grow rounded bg-gray-900 p-4">
        <div v-if="isLoading" class="text-center">
          <VioLoaderIndicatorSpinner class="m-auto h-32 w-32" />
          {{ t('globalStatusLoading') }}
        </div>
        <div v-else-if="store.playerData.currentPlaylist" class="m-auto w-5/6">
          <ul
            v-if="store.playerData.currentPlaylist.collections.length"
            class="flex flex-wrap justify-center"
          >
            <li
              v-for="collection in store.playerData.currentPlaylist.collections"
              :key="collection.name"
              class="max-w-xxs min-w-xxs m-2"
            >
              <VioLink
                class="block h-full w-full"
                :is-colored="false"
                :title="collection.name"
                :to="{ query: getPlaylistLink(collection.name) }"
              >
                <PlayerPlaylist class="h-full" :playlist="collection" />
              </VioLink>
            </li>
          </ul>
          <ul v-if="store.playerData.currentPlaylist.items.length">
            <li
              v-for="playlistItem of store.playerData.currentPlaylist.items"
              :key="playlistItem.fileName"
              class="border-b border-gray-800 first:border-t hover:bg-gray-800"
            >
              <PlayerPlaylistItem
                :class="{
                  'text-yellow-500':
                    routeQueryPlaylist &&
                    store.playerData.currentPlaylist &&
                    store.playerData.currentTrack &&
                    routeQueryPlaylist ===
                      store.playerData.currentPlaylist.name &&
                    playlistItem.fileName ===
                      store.playerData.currentTrack.fileName,
                }"
                :playlist-item="playlistItem"
                @download="download(playlistItem)"
                @play="play(playlistItem, routeQueryPlaylist)"
              />
            </li>
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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Playlist, PlaylistItem } from '~/types/player'
import { useStore } from '~/store'

definePageMeta({ colorMode: 'dark' })

const store = useStore()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const fireError = useFireError()
const { play } = usePlyr()

// data
const isLoading = ref(false)
const title = t('titlePage')

// methods
const init = async () => {
  isLoading.value = true

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
        ...(routeQueryPlaylist.value && {
          prefix: routeQueryPlaylist.value,
        }),
      },
    })

    mergeByKey(playlistDataFetch, data.value?.playlistData, 'name')
    continuationToken = data.value?.nextContinuationToken
  } while (continuationToken)

  store.playerData.currentPlaylist = playlistDataFetch
  store.playerData.currentPlaylist.name = routeQueryPlaylist.value
    ? decodeURIComponent(routeQueryPlaylist.value)
    : store.playerData.currentPlaylist.name

  // Try to select and play track as indicated by query parameter.
  if (
    store.playerData.isPaused &&
    store.playerData.currentPlaylist &&
    routeQueryPlaylist.value &&
    routeQueryTrack.value
  ) {
    for (const playlistItem of store.playerData.currentPlaylist.items) {
      if (playlistItem.fileName === routeQueryTrack.value) {
        play(playlistItem, routeQueryPlaylist.value)
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
  const queryObject = JSON.parse(JSON.stringify(route.query))

  // Append chosen playlist's name to current playlist path.
  queryObject.playlist = [queryObject.playlist, name]
    .filter(Boolean) // Prevent initial join character.
    .join('/')

  delete queryObject.track

  return queryObject
}
const download = async (playlistItem: PlaylistItem) => {
  const link = document.createElement('a')
  const signedUrl = await getSignedUrl({
    playlistItem,
    playlistPath: routeQueryPlaylist.value,
  })

  if (!signedUrl)
    return fireError({ error: new Error('Could not get signed url!') })

  link.setAttribute('href', signedUrl)
  link.setAttribute('download', '123.mp3') // This value is never shown to the user in current browser implementations.
  link.click()
}

// computations
const breadcrumbSuffixes = computed(() => {
  if (!routeQueryPlaylist.value) return

  const queryObject = JSON.parse(JSON.stringify(route.query))
  const breadcrumbSuffixes = []
  const routeQueryPlaylistParts = routeQueryPlaylist.value.split('/')

  for (const [
    index,
    routeQueryPlaylistPart,
  ] of routeQueryPlaylistParts.entries()) {
    let playlistPath = ''

    for (let i = 0; i <= index; i++) {
      if (i !== 0) {
        playlistPath += '/'
      }

      playlistPath += routeQueryPlaylistParts[i]
    }

    breadcrumbSuffixes.push({
      name: routeQueryPlaylistPart,
      to: localePath({
        path: '/player',
        query: {
          ...queryObject,
          playlist: playlistPath,
          track:
            index === routeQueryPlaylistParts.length - 1
              ? queryObject.track
              : undefined,
        },
      }),
    })
  }

  return breadcrumbSuffixes
})
const routeQueryPlaylist = computed(() => {
  if (typeof route.query.playlist === 'string') {
    return route.query.playlist
  }
})
const routeQueryTrack = computed(() => {
  if (typeof route.query.track === 'string') {
    return route.query.track
  }
})

// lifecycle
watch(
  () => route.query,
  async (current, old) => {
    if (current.playlist === old.playlist) return

    await init()
  },
)

// initialization
await init()
useHeadDefault({
  title: titleHead(),
  extension: {
    description: t('description'),
  },
})
</script>

<script lang="ts">
export default {
  name: 'IndexPage',
}
</script>

<i18n lang="yaml">
de:
  description: Mixe von DJ cReal anhören.
  itemsNone: Keine Elemente gefunden.
  titlePage: Player
en:
  description: Listen to mixes by DJ cReal.
  itemsNone: No items found.
  titlePage: Player
</i18n>
