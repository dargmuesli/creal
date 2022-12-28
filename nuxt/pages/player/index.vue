<template>
  <div class="container mx-auto">
    <section>
      <LayoutBreadcrumbs
        :suffixes="
          !Array.isArray(route.query.playlist) &&
          route.query.playlist?.split('/')
        "
        suffixes-key="playlist"
      >
        {{ title }}
      </LayoutBreadcrumbs>
      <div class="grow rounded bg-gray-900 p-4">
        <div v-if="isLoading" class="text-center">
          <LoaderIndicatorSpinner class="m-auto h-32 w-32" />
          {{ t('globalLoading') }}
        </div>
        <div v-else-if="playlistData" class="m-auto w-5/6">
          <ul
            v-if="playlistData.collections.length"
            class="flex flex-wrap justify-center"
          >
            <li
              v-for="collection in playlistData.collections"
              :key="collection.name"
              class="m-2 max-w-xxs min-w-xxs"
            >
              <AppLink
                class="block h-full w-full"
                :title="collection.name"
                :to="getPlaylistLink(collection.name)"
              >
                <PlayerPlaylist class="h-full" :playlist="collection" />
              </AppLink>
            </li>
          </ul>
          <ul v-if="playlistData.items.length">
            <li
              v-for="playlistItem of playlistData.items"
              :key="playlistItem.name"
              class="border-b border-gray-800 first:border-t hover:bg-gray-800"
            >
              <PlayerPlaylistItem
                :class="{
                  'text-yellow-500':
                    route.query.playlist &&
                    route.query.playlist === store.currentTrackPlaylistName &&
                    playlistItem.name === store.currentTrackName,
                }"
                :playlist-item="playlistItem"
                @download="onPlaylistItemDownload"
                @play="onPlaylistItemSelect"
              />
            </li>
          </ul>
          <div
            v-if="
              !playlistData.collections.length && !playlistData.items.length
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
import type { Playlist, PlaylistItem } from '~/types/playlist'
import { useStore } from '~/store'
import { PLAYER_PREFIX } from '~/utils/constants'

definePageMeta({ colorMode: 'dark' })

// const emit = defineEmits<{
//   (e: 'plyr', sourceInfo: Plyr.SourceInfo, isManuallySet: boolean): void
// }>()

const store = useStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const fireError = useFireError()

// data
const isLoading = ref(false)
const playlistData = ref<Playlist>()
const title = t('titlePage')

// methods
// async fetch() {
async function init() {
  isLoading.value = true

  let continuationToken: string | undefined
  const playlistDataFetch = {
    name: 'root',
    collections: [],
    items: [],
    cover: false,
  } as Playlist

  do {
    const { data } = await useFetch('/api/player/playlists', {
      params: {
        ...(continuationToken && {
          'continuation-token': continuationToken,
        }),
        ...((route.query.playlist as any) !== undefined && {
          prefix: route.query.playlist as any,
        }),
      },
    })

    mergeByKey(playlistDataFetch, data.value?.playlistData, 'name')
    continuationToken = data.value?.nextContinuationToken
  } while (continuationToken)

  playlistData.value = playlistDataFetch

  // Try to select and play track as indicated by query parameter.
  const queryTrack = route.query.track

  if (playlistData.value && typeof queryTrack === 'string') {
    for (const playlistItem of playlistData.value.items) {
      if (playlistItem.name === queryTrack) {
        onPlaylistItemSelect(playlistItem, false)
        break
      }
    }
  }

  isLoading.value = false
}
function titleHead() {
  return store.currentTrackName && !store.isPlayerPaused
    ? store.currentTrackName
    : title
}

// ///////////////////////////////////////////////////////////////////////////
// Util //////////////////////////////////////////////////////////////////////

async function getSignedUrl(playlistItem: PlaylistItem) {
  const key =
    PLAYER_PREFIX +
    (route.query.playlist ? route.query.playlist + '/' : '') +
    playlistItem.name +
    '.' +
    playlistItem.extension
  const {
    data: { value },
  } = await useFetch('/api/player/signed-url', {
    params: { key },
  })
  return value
}
function serializeQueryString(object: any) {
  const playlistLinkParts: Array<string> = []

  for (const [key, value] of Object.entries(object)) {
    playlistLinkParts.push(!value ? key : `${key}=${value}`)
  }

  return `?${playlistLinkParts.join('&')}`
}

// ///////////////////////////////////////////////////////////////////////////
// Template //////////////////////////////////////////////////////////////////

function getPlaylistLink(name: string) {
  const queryObject = JSON.parse(JSON.stringify(route.query))

  // Append chosen playlist's name to current playlist path.
  queryObject.playlist = encodeURIComponent(
    [queryObject.playlist, name]
      .filter(Boolean) // Prevent initial join character.
      .join('/')
  )
  delete queryObject.track

  return serializeQueryString(queryObject)
}

// ///////////////////////////////////////////////////////////////////////////
// Events ////////////////////////////////////////////////////////////////////

async function onPlaylistItemDownload(playlistItem: PlaylistItem) {
  const link = document.createElement('a')
  const signedUrl = await getSignedUrl(playlistItem)

  if (!signedUrl)
    return fireError({ error: new Error('Could not get signed url!') })

  link.setAttribute('href', signedUrl)
  link.setAttribute('download', '123.mp3') // This value is never shown to the user in current browser implementations.
  link.click()
}
async function onPlaylistItemSelect(
  playlistItem: PlaylistItem,
  isManuallySet = true
) {
  store.isPlayerVisible = true
  store.currentTrackName = playlistItem.name
  store.currentTrackPlaylistName =
    typeof route.query.playlist === 'string'
      ? decodeURIComponent(route.query.playlist)
      : undefined

  // Activate only the newly selected playlist item.
  if (!playlistData) {
    return
  }

  // Set query parameter.
  const queryObject = JSON.parse(JSON.stringify(route.query))
  const queryObjectTrack = playlistItem.name

  // Conditionally update track query parameter.
  if (queryObject.track !== queryObjectTrack) {
    queryObject.track = queryObjectTrack

    router.replace({
      path: route.path,
      query: queryObject,
    })
  }

  // Get meta.
  const key =
    PLAYER_PREFIX +
    (route.query.playlist ? route.query.playlist + '/' : '') +
    playlistItem.name +
    '.json'

  if (playlistItem.meta) {
    store.currentTrackMeta = await $fetch('/api/player/get-object', {
      params: { key },
    })
  } else {
    store.currentTrackMeta = undefined
    store.currentTrackDescription = undefined
  }

  const signedUrl = await getSignedUrl(playlistItem)

  if (!signedUrl)
    return fireError({ error: new Error('Could not get signed url!') })

  store.setPlayerSourceInfo(
    {
      type: 'audio',
      sources: [
        {
          src: signedUrl,
          type: 'audio/mp3',
        },
      ],
    },
    isManuallySet
  )
}

// lifecycle
watch(
  () => route.query,
  async (current, old) => {
    if (current.playlist === old.playlist) return

    await init()
  }
)

// initialization
await init()
useHeadDefault(titleHead(), {
  meta: [
    {
      hid: 'description',
      property: 'description',
      content: t('description'),
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: t('description'),
    },
  ],
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
