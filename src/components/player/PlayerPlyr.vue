<template>
  <div class="fixed bottom-0 left-0 right-0">
    <div
      v-if="store.playerData.currentTrack?.fileName"
      class="flex flex-col justify-evenly bg-white px-2 font-bold text-black sm:flex-row"
    >
      <span>
        {{ store.playerData.currentTrack.fileName }}
        <span
          v-if="store.playerData.currentTrack.meta?.createdTime"
          class="font-normal"
        >
          {{ t('on') }}
          {{
            dateTime(store.playerData.currentTrack.meta.createdTime).format('L')
          }}
        </span>
      </span>
      <span v-if="store.playerData.currentTrack.meta?.description">
        {{ store.playerData.currentTrack.meta.description }}
      </span>
      <a
        v-if="store.playerData.currentTrack.meta?.mixcloudLink"
        class="flex items-center gap-1"
        :href="store.playerData.currentTrack.meta.mixcloudLink"
        rel="noopener noreferrer"
        target="_blank"
      >
        <VioIconMixcloud classes="h-5 w-5" /> {{ t('mixcloud') }}
      </a>
      <button class="flex items-center gap-1 font-bold" @click="share">
        <VioIconShare classes="h-4 w-4" />
        {{ t('linkCopy') }}
      </button>
    </div>
    <div :class="{ hidden: !store.playerData.isVisible }">
      <ClientOnly>
        <vue-plyr
          ref="plyrRef"
          :emit="['ended', 'pause', 'playing', 'timeupdate']"
        >
          <audio crossorigin="anonymous" />
        </vue-plyr>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TrackListItem } from '~/types/player'
import { useStore } from '~/store'

const dateTime = useDateTime()
const store = useStore()
const { t } = useI18n()
const { play } = usePlyr()
const fireError = useFireError()

// data
const isInitialized = ref(false)
const plyrRef = ref<{ player: Plyr }>()

// methods
const binarySearch = <A, B>(
  ar: B[],
  el: A,
  compareFn: (a: A, b: B) => number,
) => {
  let m = 0
  let n = ar.length - 1

  while (m <= n) {
    const k = (n + m) >> 1
    const cmp = compareFn(el, ar[k])

    if (cmp > 0) {
      m = k + 1
    } else if (cmp < 0) {
      n = k - 1
    } else {
      return k
    }
  }

  return m - 1
}
const trackListItemComparator = (time: number, b: TrackListItem) =>
  time - b.startSeconds

const closeAllow = () => (window.onbeforeunload = () => {})

const closeProtect = () =>
  (window.onbeforeunload = () =>
    'The music will stop playing if you navigate away.')

const initPlyr = (plyr: { player: Plyr }) => {
  plyr.player.on('ended', () => {
    closeAllow()

    if (!store.playerData.currentPlaylist || !store.playerData.currentTrack)
      return

    for (
      let i = 0;
      i < store.playerData.currentPlaylist.items.length - 1;
      i++
    ) {
      if (
        store.playerData.currentPlaylist.items[i].fileName ===
        store.playerData.currentTrack.fileName
      ) {
        play(
          store.playerData.currentPlaylist.items[i + 1],
          store.playerData.currentPlaylist.name,
        )
        break
      }
    }
  })
  plyr.player.on('pause', () => {
    store.playerData.isPaused = true
    closeAllow()
  })
  // plyr.player.on('playing', () => {
  //   store.playerData.isPaused = false
  //   closeProtect()
  // })
  plyr.player.on('timeupdate', () => {
    if (!store.playerData.currentTrack?.meta?.tracklist || !player.value) return

    const trackListItem =
      store.playerData.currentTrack.meta.tracklist[
        binarySearch(
          store.playerData.currentTrack.meta.tracklist,
          player.value.currentTime,
          trackListItemComparator,
        )
      ]

    const currentTrackDescription = trackListItem
      ? trackListItem.artistName + ' - ' + trackListItem.songName
      : ''

    if (
      store.playerData.currentTrack.meta.description !== currentTrackDescription
    ) {
      store.playerData.currentTrack.meta.description = currentTrackDescription
    }
  })

  isInitialized.value = true
}
const share = async () => {
  if (
    !window ||
    !store.playerData.currentPlaylist?.name ||
    !store.playerData.currentTrack?.fileName
  )
    return fireError({ error: new Error(t('copyError')) })

  await copyText(
    `${window.location.origin}/player?playlist=${encodeURIComponent(
      store.playerData.currentPlaylist.name,
    )}&track=${encodeURIComponent(store.playerData.currentTrack.fileName)}`,
  )
}

// computations
const player = computed(() => {
  if (!plyrRef.value) return

  if (!isInitialized.value) {
    initPlyr(plyrRef.value)
  }

  return plyrRef.value.player
})

// lifecycle
watch(
  () => store.playerData.sourceInfo,
  (current, _old) => {
    if (
      current &&
      player.value
      // !store.playerData.isPaused
    ) {
      player.value.source = current
      player.value.play()
      store.playerData.isPaused = false
      closeProtect()
    }
  },
)
</script>

<i18n lang="yaml">
de:
  copyError: Das Kopieren war nicht erfolgreich.
  linkCopy: Copy link
  mixcloud: Mixcloud
  on: on
en:
  copyError: Copying failed.
  linkCopy: Link kopieren
  mixcloud: Mixcloud
  on: am
</i18n>
