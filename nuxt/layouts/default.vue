<template>
  <div>
    <header
      class="flex items-center justify-center lg:justify-start p-4 md:px-8"
    >
      <nuxt-link :to="'/'" class="flex items-center">
        <div id="logo" class="h-10 w-10" />
        <span class="font-bold text-lg"> cReal </span>
      </nuxt-link>
    </header>
    <main class="container flex-1 min-h-screen mx-auto px-4 md:px-8 py-8">
      <nuxt />
    </main>
    <footer
      class="bg-gray-900 leading-6 text-sm"
      :class="{ 'mb-20': storePlayerModule.isPlayerVisible }"
    >
      <div class="container mx-auto px-2 py-8">
        <div class="flex flex-wrap justify-evenly mx-auto w-5/6">
          <div
            class="
              flex flex-1
              md:flex-none
              flex-basis-50
              md:flex-basis-auto
              flex-col
              items-start
              p-4
            "
          >
            <span class="font-medium leading-7 text-lg whitespace-nowrap">
              Rechtliches
            </span>
            <AppLink :to="'/legal-notice'">Impressum</AppLink>
          </div>
        </div>
        <div class="p-2" />
        <div class="flex items-center mx-auto w-9/12">
          <div class="bg-white h-px flex-1" />
          <LoaderImage
            alt="cReals Logo"
            class="brightness-100 h-12 mx-12 w-12"
            height="48"
            src="/assets/static/logos/creal.svg"
            width="48"
          />
          <div class="bg-white h-px flex-1" />
        </div>
        <p class="p-2 text-center">
          © {{ new Date().getFullYear() }} Jonas Thelemann. Alle Rechte
          vorbehalten.
        </p>
      </div>
    </footer>
    <div class="fixed bottom-0 left-0 right-0">
      <div
        v-if="storePlayerModule.currentTrackName"
        class="
          bg-white
          flex flex-col
          sm:flex-row
          font-bold
          justify-evenly
          text-black
        "
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
            on
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
          :href="storePlayerModule.currentTrackMeta.mixcloudLink"
          rel="noopener noreferrer"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'mixcloud']" /> Mixcloud
        </a>
        <button class="font-bold" @click="share">
          <font-awesome-icon :icon="['fas', 'share-alt']" /> Copy link
        </button>
      </div>
      <vue-plyr
        ref="plyr"
        :class="{ hidden: !storePlayerModule.isPlayerVisible }"
        :emit="['ended', 'pause', 'playing', 'timeupdate']"
        @ended="onPlyrEnded"
        @pause="onPlyrPause"
        @playing="onPlyrPlaying"
        @timeupdate="onPlyrTimeUpdate"
      >
        <audio />
      </vue-plyr>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import Plyr from 'plyr'

import { TrackListItem } from '../api/player/playlists'
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

@Component({})
export default class Layout extends Vue {
  storePlayerModule = getModule(PlayerModule, this.$store)

  get player() {
    const plyr = this.$refs.plyr as any

    if (!plyr) return

    return plyr.player
  }

  created() {
    this.$nuxt.$on(
      'plyr',
      (sourceInfo: Plyr.SourceInfo, isManuallySet: boolean) => {
        if (!this.player) return

        if (this.storePlayerModule.isPlayerPaused === null || isManuallySet) {
          this.player.source = sourceInfo

          if (this.storePlayerModule.isPlayerPaused !== null || isManuallySet) {
            this.player.play()
          }
        }
      }
    )
  }

  closeFree() {
    window.onbeforeunload = () => {}
  }

  closeProtect() {
    window.onbeforeunload = () => {
      return 'The music will stop playing if you navigate away.'
    }
  }

  onPlyrEnded() {
    this.closeFree()
  }

  onPlyrPause() {
    this.storePlayerModule.setIsPlayerPaused(true)
    this.closeFree()
  }

  onPlyrPlaying() {
    this.storePlayerModule.setIsPlayerPaused(false)
    this.closeProtect()
  }

  onPlyrTimeUpdate() {
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
  }

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
  }
}
</script>

<style scoped>
#logo {
  background-image: url(/assets/static/logos/creal.svg);
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
