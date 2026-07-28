<template>
  <div class="container mx-auto">
    <section>
      <VioLayoutBreadcrumbs :prefixes="breadcrumbPrefixes">
        {{ currentLabel }}
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
              <CrPlayerPlaylist
                class="h-full"
                :playlist="collection"
                :playlist-path="resolvedPlaylistPath"
              />
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
                resolvedPlaylistPath === store.playerData.currentPlaylistPath &&
                store.playerData.currentTrack &&
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
const mixLocalePath = useMixLocalePath()
const route = useRoute()
const alertError = useAlertError()
const { play } = usePlyr()
// Captured synchronously: navigateTo() needs the Nuxt app context, which
// is only implicitly available before the first `await` — init() calls it
// after awaiting a fetch, so it must be restored explicitly.
const nuxtApp = useNuxtApp()

// data
const isLoading = ref(false)
const resolvedPlaylistPath = ref<string>()
const title = computed(() => t('titlePage'))

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
    const data = await $fetch<FetchPlaylist>('/api/player/playlists', {
      params: {
        ...(continuationToken && {
          'continuation-token': continuationToken,
        }),
        ...(prefix && {
          prefix,
        }),
      },
    })

    mergeByKey(playlistDataFetch, data?.playlistData, 'name')
    continuationToken = data?.nextContinuationToken
  } while (continuationToken)

  return playlistDataFetch
}
const getPathWithoutLastPart = (pathParts: string[]) =>
  pathParts.slice(0, -1).join('/')
const isTrackInPlaylist = (
  playlistData: Playlist | undefined,
  trackCandidate: string | undefined,
) =>
  !!trackCandidate &&
  !!playlistData?.items.some(
    (playlistItem) => playlistItem.fileName === trackCandidate,
  )
// A trailing slash unambiguously means "collection" (an S3 prefix), no
// trailing slash means "track" (an S3 object key) — see getCollectionPath /
// getTrackPath. This makes path resolution deterministic: there is never a
// need to guess whether a URL segment names a folder or a file.
const resolveRoutePath = () => {
  const pathParts = routePathParts.value
  const isCollectionRoute = pathParts.length === 0 || route.path.endsWith('/')

  return isCollectionRoute
    ? { playlistPath: pathParts.join('/') || undefined, track: undefined }
    : {
        playlistPath: getPathWithoutLastPart(pathParts) || undefined,
        track: pathParts[pathParts.length - 1],
      }
}
let initRequestId = 0

const init = async () => {
  const requestId = ++initRequestId
  isLoading.value = true

  const { playlistPath, track } = resolveRoutePath()
  const playlistDataFetch = await fetchPlaylistData(playlistPath)

  if (requestId !== initRequestId) return

  if (track && !isTrackInPlaylist(playlistDataFetch, track)) {
    // Non-canonical URL (missing trailing slash) whose last segment isn't
    // actually a track here either: redirect to the canonical collection
    // URL instead of silently rendering the wrong thing. This re-enters
    // init() via the route watcher with a definitive collection route.
    await nuxtApp.runWithContext(() =>
      navigateTo(
        mixLocalePath(getCollectionPath(routePathParts.value.join('/'))),
        {
          redirectCode: 301,
          replace: true,
        },
      ),
    )
    return
  }

  resolvedPlaylistPath.value = playlistPath
  store.playerData.currentPlaylist = playlistDataFetch
  store.playerData.currentPlaylistPath = playlistPath

  // Try to select and play track as indicated by route path.
  if (store.playerData.isPaused && track) {
    const playlistItem = playlistDataFetch.items.find(
      (item) => item.fileName === track,
    )

    if (playlistItem) play(playlistItem, playlistPath, true)
  }

  isLoading.value = false
}
const titleHead = computed(() =>
  store.playerData.currentTrack?.fileName && !store.playerData.isPaused
    ? store.playerData.currentTrack.fileName
    : title.value,
)
const getPlaylistPath = (name: string) =>
  joinPathSegments(resolvedPlaylistPath.value, name)
const getPlaylistLink = (name: string) =>
  mixLocalePath(getCollectionPath(getPlaylistPath(name)))
const download = async (playlistItem: PlaylistItem) => {
  const link = document.createElement('a')
  const signedUrl = await getSignedUrl({
    playlistItem,
    playlistPath: resolvedPlaylistPath.value,
  })

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

// computations
const routePathParts = computed(() => {
  // A trailing slash on the URL surfaces as a trailing empty segment here
  // (e.g. `['Muesli Mix', '']`) — strip it so it can't corrupt playlistPath
  // into a value with an embedded trailing slash.
  if (Array.isArray(route.params.path)) {
    return route.params.path.filter(Boolean)
  }

  if (typeof route.params.path === 'string') return [route.params.path]

  return []
})
// VioLayoutBreadcrumbs always links its own slot content to the current
// route.path (it's the "you are here" label, not a root link) — so "Mixes"
// and every ancestor level must go through `prefixes` instead, leaving only
// the deepest segment (the actual current page) in the slot.
const breadcrumbPrefixes = computed(() => {
  // At root, the slot itself already renders "Mixes" as the (self-linked)
  // current page — don't also list it as a prefix, or it shows up twice.
  if (!resolvedPlaylistPath.value) return

  const prefixes = [
    { name: title.value, to: mixLocalePath(getCollectionPath()) },
  ]
  const playlistPathParts = resolvedPlaylistPath.value.split('/')
  // The deepest playlist segment is the current page (rendered via the slot
  // below), regardless of whether a track within it is also deep-linked —
  // a track is content inside the playlist, not a breadcrumb level of its own.
  const clickableCount = playlistPathParts.length - 1

  for (let index = 0; index < clickableCount; index++) {
    const playlistPath = playlistPathParts.slice(0, index + 1).join('/')

    prefixes.push({
      name: playlistPathParts[index]!,
      to: mixLocalePath(getCollectionPath(playlistPath)),
    })
  }

  return prefixes
})
const currentLabel = computed(() => {
  if (resolvedPlaylistPath.value) {
    const playlistPathParts = resolvedPlaylistPath.value.split('/')

    return playlistPathParts[playlistPathParts.length - 1]
  }

  return title.value
})

// lifecycle
watch(
  () => route.path,
  async () => {
    const { playlistPath } = resolveRoutePath()

    // Skip the refetch when only the deep-linked track changed within the
    // same playlist — the breadcrumb only reflects the playlist path anyway.
    if (playlistPath === resolvedPlaylistPath.value) return

    await init()
  },
)

// initialization
await init()
useCrealHeadDefault({
  description: t('description'),
  title: titleHead,
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
