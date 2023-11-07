<template>
  <div class="container mx-auto p-4 md:px-8">
    <div class="flex min-h-screen flex-col pb-32">
      <LayoutHeader />
      <main class="flex flex-1 overflow-hidden">
        <NuxtLoadingIndicator color="#fff" />
        <slot />
      </main>
    </div>
    <VioLayoutFooter :class="{ 'mb-20': store.playerData.isVisible }">
      <VioLayoutFooterCategory :heading="t('legal')">
        <VioLink :to="localePath('/legal-notice')">
          {{ t('legalNotice') }}
        </VioLink>
        <VioLink :to="localePath('/privacy-policy')">
          {{ t('privacyPolicy') }}
        </VioLink>
      </VioLayoutFooterCategory>
      <VioLayoutFooterCategory :heading="t('preferences')">
        <div class="grid grid-cols-2 grid-rows-2 items-center gap-2">
          <label for="vio-i18n-select">{{ t('language') }}</label>
          <select
            id="vio-i18n-select"
            class="form-input pr-8"
            @change="onI18nChange"
          >
            <option
              v-for="availableLocale in availableLocales"
              :key="availableLocale"
              :selected="availableLocale === locale"
              :value="availableLocale"
            >
              {{ getLocaleName(availableLocale) }}
            </option>
          </select>
          <label for="vio-cookie-preferences">{{ t('cookies') }}</label>
          <VioButtonColored
            id="vio-cookie-preferences"
            :aria-label="t('preferences')"
            :is-primary="false"
            @click="cookieControl.isModalActive.value = true"
          >
            {{ t('preferences') }}
          </VioButtonColored>
        </div>
      </VioLayoutFooterCategory>
      <template #logo>
        <IconLogo class="mx-12 h-12 w-12 opacity-60 brightness-0 invert" />
      </template>
    </VioLayoutFooter>
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
              dateTime(store.playerData.currentTrack.meta.createdTime).format(
                'L',
              )
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
            <audio />
          </vue-plyr>
        </ClientOnly>
      </div>
    </div>
    <CookieControl :locale="locale" />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '@dargmuesli/nuxt-cookie-control/dist/runtime/types'
import { I18N_MODULE_CONFIG } from '@dargmuesli/nuxt-vio/utils/constants'
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'
import Plyr from 'plyr'
import type { WritableComputedRef } from 'vue'

import type { TrackListItem } from '~/types/player'
import { useStore } from '~/store'

const store = useStore()
const localePath = useLocalePath()
const i18n = useI18n()
const { availableLocales, t } = i18n
const { play } = usePlyr()
const fireError = useFireError()
const dateTime = useDateTime()
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()
const cookieControl = useCookieControl()

// data
const isInitialized = ref(false)
const locale = i18n.locale as WritableComputedRef<Locale>
const plyrRef = ref<{ player: Plyr }>()

// methods
const binarySearch = (ar: any[], el: any, compareFn: Function) => {
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
const getLocaleName = (locale: string) => {
  const locales: LocaleObject[] = I18N_MODULE_CONFIG.locales.filter(
    (localeObject) => localeObject.code === locale,
  )

  if (locales.length) {
    return locales[0].name
  } else {
    return undefined
  }
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
const onI18nChange = async (event: Event) =>
  await router.push({
    path: switchLocalePath((event.target as HTMLInputElement).value),
  })
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
  cookies: Cookies
  copyError: Das Kopieren war nicht erfolgreich.
  language: Sprache
  legal: Rechtliches
  legalNotice: Impressum
  linkCopy: Copy link
  mixcloud: Mixcloud
  on: on
  preferences: Einstellungen
  privacyPolicy: Datenschutz
en:
  cookies: Cookies
  copyError: Copying failed.
  language: Language
  legal: Legal
  legalNotice: Legal notice
  linkCopy: Link kopieren
  mixcloud: Mixcloud
  on: am
  preferences: Preferences
  privacyPolicy: Privacy policy
</i18n>
