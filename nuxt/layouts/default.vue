<template>
  <div>
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="container mx-auto flex flex-1 flex-col px-4 py-8 md:px-8">
        <slot />
      </main>
    </div>
    <footer
      class="bg-gray-900 text-sm leading-6"
      :class="{ 'mb-20': store.isPlayerVisible }"
    >
      <div class="px-2 py-8">
        <div class="mx-auto flex w-9/12 items-center">
          <div class="h-px flex-1 bg-gray-400" />
          <LoaderImage
            alt="DJ cReals Logo"
            class="mx-12 h-12 w-12 brightness-100"
            height="48"
            src="/assets/static/logos/creal.svg"
            width="48"
          />
          <div class="h-px flex-1 bg-gray-400" />
        </div>
        <p class="p-2 text-center text-gray-400">
          {{ t('copyright', { year: new Date().getFullYear() }) }}
          <br />
          <AppLink class="text-link" :to="localePath('/legal-notice')">
            {{ t('legalNotice') }}
          </AppLink>
        </p>
      </div>
    </footer>
    <div class="fixed bottom-0 left-0 right-0">
      <div
        v-if="store.currentTrackName"
        class="flex flex-col justify-evenly bg-white px-2 font-bold text-black sm:flex-row"
      >
        <span>
          {{ store.currentTrackNameShort || store.currentTrackName }}
          <span
            v-if="store.currentTrackMeta && store.currentTrackMeta.createdTime"
            class="font-normal"
          >
            {{ t('on') }}
            {{ $moment(store.currentTrackMeta.createdTime).format('L') }}
          </span>
        </span>
        <span v-if="store.currentTrackDescription">
          {{ store.currentTrackDescription }}
        </span>
        <a
          v-if="store.currentTrackMeta && store.currentTrackMeta.mixcloudLink"
          class="flex items-center gap-1"
          :href="store.currentTrackMeta.mixcloudLink"
          rel="noopener noreferrer"
          target="_blank"
        >
          <IconMixcloud classes="h-5 w-5" /> {{ t('mixcloud') }}
        </a>
        <button class="flex items-center gap-1 font-bold" @click="share">
          <IconShare classes="h-4 w-4" />
          {{ t('linkCopy') }}
        </button>
      </div>
      <div :class="{ hidden: !store.isPlayerVisible }">
        <ClientOnly>
          <vue-plyr
            ref="plyr"
            :emit="['ended', 'pause', 'playing', 'timeupdate']"
          >
            <audio />
          </vue-plyr>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Plyr from 'plyr'

import { TrackListItem } from '~/types/playlist'
import { useStore } from '~/store'

const store = useStore()

// data
const isInitialized = ref(false)

// methods
function binarySearch(ar: any[], el: any, compareFn: Function) {
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
function trackListItemComparator(time: number, b: TrackListItem) {
  return time - b.startSeconds
}
function closeAllow() {
  window.onbeforeunload = () => {}
}
function closeProtect() {
  window.onbeforeunload = () => {
    return 'The music will stop playing if you navigate away.'
  }
}
function init() {
  $nuxt.$on('plyr', (sourceInfo: Plyr.SourceInfo, isManuallySet: boolean) => {
    if (!player) return

    if (!store.isPlayerPaused || isManuallySet) {
      player.source = sourceInfo

      if (store.isPlayerPaused || isManuallySet) {
        player.play()
      }
    }
  })
}
function initPlyr(plyr: any) {
  plyr.player.on('ended', () => {
    closeAllow()
    $nuxt.$emit('plyrEnd')
  })
  plyr.player.on('pause', () => {
    store.setIsPlayerPaused(true)
    closeAllow()
  })
  plyr.player.on('playing', () => {
    store.setIsPlayerPaused(false)
    closeProtect()
  })
  plyr.player.on('timeupdate', () => {
    if (store.currentTrackMeta && store.currentTrackMeta.tracklist) {
      const trackListItem =
        store.currentTrackMeta.tracklist[
          binarySearch(
            store.currentTrackMeta.tracklist,
            player.currentTime,
            trackListItemComparator
          )
        ]

      const currentTrackDescription = trackListItem
        ? trackListItem.artistName + ' - ' + trackListItem.songName
        : ''

      if (store.currentTrackDescription !== currentTrackDescription) {
        store.setCurrentTrackDescription(currentTrackDescription)
      }
    }
  })

  isInitialized.value = true
}
function share() {
  if (
    !process.browser ||
    !store.currentTrackPlaylistName ||
    !store.currentTrackName
  )
    return

  $copyText(
    `${window.location.origin}/player?playlist=${encodeURIComponent(
      store.currentTrackPlaylistName
    )}&track=${encodeURIComponent(store.currentTrackName)}`
  )
}

// computations
const player = computed(() => {
  const plyr = $refs.plyr as any

  if (!plyr) return

  if (!isInitialized.value) {
    initPlyr(plyr)
  }

  return plyr.player
})

// initialization
init()
useHeadLayout()
$moment.locale(locale.value)
</script>

<script lang="ts">
export default {
  name: 'IndexPage',
}
</script>

<i18n lang="yaml">
en:
  copyright: © {year} Jonas Thelemann. All rights reserved.
  legalNotice: Legal notice
  linkCopy: Copy link
  mixcloud: Mixcloud
  on: on
de:
  copyright: © {year} Jonas Thelemann. Alle Rechte vorbehalten.
  legalNotice: Impressum
  linkCopy: Link kopieren
  mixcloud: Mixcloud
  on: am
</i18n>
