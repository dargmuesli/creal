<template>
  <div>
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="container mx-auto flex flex-1 flex-col px-4 py-8 md:px-8">
        <nuxt />
      </main>
    </div>
    <footer
      class="bg-gray-900 text-sm leading-6"
      :class="{ 'mb-20': storePlayerModule.isPlayerVisible }"
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
          {{ $t('copyright', { year: new Date().getFullYear() }) }}
          <br />
          <AppLink class="text-link" :to="localePath('/legal-notice')">
            {{ $t('legalNotice') }}
          </AppLink>
        </p>
      </div>
    </footer>
    <div class="fixed bottom-0 left-0 right-0">
      <div
        v-if="storePlayerModule.currentTrackName"
        class="flex flex-col justify-evenly bg-white px-2 font-bold text-black sm:flex-row"
      >
        <span>
          {{
            storePlayerModule.currentTrackNameShort ||
            storePlayerModule.currentTrackName
          }}
          <span
            v-if="
              storePlayerModule.currentTrackMeta &&
              storePlayerModule.currentTrackMeta.createdTime
            "
            class="font-normal"
          >
            {{ $t('on') }}
            {{
              $moment(storePlayerModule.currentTrackMeta.createdTime).format(
                'L'
              )
            }}
          </span>
        </span>
        <span v-if="storePlayerModule.currentTrackDescription">
          {{ storePlayerModule.currentTrackDescription }}
        </span>
        <a
          v-if="
            storePlayerModule.currentTrackMeta &&
            storePlayerModule.currentTrackMeta.mixcloudLink
          "
          class="flex items-center gap-1"
          :href="storePlayerModule.currentTrackMeta.mixcloudLink"
          rel="noopener noreferrer"
          target="_blank"
        >
          <IconMixcloud classes="h-5 w-5" /> {{ $t('mixcloud') }}
        </a>
        <button class="flex items-center gap-1 font-bold" @click="share">
          <IconShare classes="h-4 w-4" />
          {{ $t('linkCopy') }}
        </button>
      </div>
      <div :class="{ hidden: !storePlayerModule.isPlayerVisible }">
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

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import Plyr from 'plyr'

import { defineComponent } from '#app'
import { TrackListItem } from '~/types/playlist'
import PlayerModule from '~/store/modules/PlayerModule'

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

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      isInitialized: false,
      storePlayerModule: getModule(PlayerModule, this.$store),
    }
  },
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
  computed: {
    player() {
      const plyr = this.$refs.plyr as any

      if (!plyr) return

      if (!this.isInitialized) {
        this.initPlyr(plyr)
      }

      return plyr.player
    },
  },
  created() {
    this.$nuxt.$on(
      'plyr',
      (sourceInfo: Plyr.SourceInfo, isManuallySet: boolean) => {
        if (!this.player) return

        if (!this.storePlayerModule.isPlayerPaused || isManuallySet) {
          this.player.source = sourceInfo

          if (this.storePlayerModule.isPlayerPaused || isManuallySet) {
            this.player.play()
          }
        }
      }
    )
  },
  beforeCreate() {
    this.$moment.locale(this.$i18n.locale)
  },
  methods: {
    closeAllow() {
      window.onbeforeunload = () => {}
    },
    closeProtect() {
      window.onbeforeunload = () => {
        return 'The music will stop playing if you navigate away.'
      }
    },
    initPlyr(plyr: any) {
      plyr.player.on('ended', () => {
        this.closeAllow()
        this.$nuxt.$emit('plyrEnd')
      })
      plyr.player.on('pause', () => {
        this.storePlayerModule.setIsPlayerPaused(true)
        this.closeAllow()
      })
      plyr.player.on('playing', () => {
        this.storePlayerModule.setIsPlayerPaused(false)
        this.closeProtect()
      })
      plyr.player.on('timeupdate', () => {
        if (
          this.storePlayerModule.currentTrackMeta &&
          this.storePlayerModule.currentTrackMeta.tracklist
        ) {
          const trackListItem =
            this.storePlayerModule.currentTrackMeta.tracklist[
              binarySearch(
                this.storePlayerModule.currentTrackMeta.tracklist,
                this.player.currentTime,
                trackListItemComparator
              )
            ]

          const currentTrackDescription = trackListItem
            ? trackListItem.artistName + ' - ' + trackListItem.songName
            : ''

          if (
            this.storePlayerModule.currentTrackDescription !==
            currentTrackDescription
          ) {
            this.storePlayerModule.setCurrentTrackDescription(
              currentTrackDescription
            )
          }
        }
      })

      this.isInitialized = true
    },
    share() {
      if (
        !process.browser ||
        !this.storePlayerModule.currentTrackPlaylistName ||
        !this.storePlayerModule.currentTrackName
      )
        return

      this.$copyText(
        `${window.location.origin}/player?playlist=${encodeURIComponent(
          this.storePlayerModule.currentTrackPlaylistName
        )}&track=${encodeURIComponent(this.storePlayerModule.currentTrackName)}`
      )
    },
  },
})
</script>

<i18n lang="yml">
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
