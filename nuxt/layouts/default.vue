<template>
  <div class="container mx-auto px-4 text-center">
    <header class="flex items-center justify-center lg:justify-start my-4">
      <nuxt-link :to="'/'" class="flex items-center">
        <div id="logo" class="h-10 w-10" />
        <span class="font-bold text-lg"> cReal </span>
      </nuxt-link>
    </header>
    <nuxt :class="{ 'mb-20': storePlayerModule.isPlayerVisible }" />
    <div class="fixed bottom-0 left-0 right-0">
      <div
        v-if="storePlayerModule.currentTrack"
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
          {{ storePlayerModule.currentTrack }}
          <span
            v-if="storePlayerModule.meta && storePlayerModule.meta.createdTime"
            class="font-normal"
          >
            on {{ $moment(storePlayerModule.meta.createdTime).format('L') }}
          </span>
        </span>
        <span v-if="storePlayerModule.currentTrackDescription">
          {{ storePlayerModule.currentTrackDescription }}
        </span>
        <a
          v-if="storePlayerModule.meta && storePlayerModule.meta.mixcloudLink"
          :href="storePlayerModule.meta.mixcloudLink"
          rel="noopener noreferrer"
          target="_blank"
        >
          <font-awesome-icon :icon="['fab', 'mixcloud']" /> Mixcloud
        </a>
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

@Component({
  head(this: Layout): Object {
    return {
      title: this.titleHead,
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: 'Listen to mixes by DJ cReal.',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Listen to mixes by DJ cReal.',
        },
      ],
    }
  },
})
export default class Layout extends Vue {
  storePlayerModule = getModule(PlayerModule, this.$store)

  get titleHead() {
    return this.storePlayerModule.currentTrack !== '' &&
      !this.storePlayerModule.isPlayerPaused
      ? this.storePlayerModule.currentTrack
      : '123'
  }

  get player() {
    const plyr = this.$refs.plyr as any

    if (!plyr) return

    return plyr.player
  }

  created() {
    this.$nuxt.$on('plyr', (sourceInfo: Plyr.SourceInfo) => {
      if (!this.player) return

      this.player.source = sourceInfo
      this.player.play()
    })
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
    if (this.storePlayerModule.meta && this.storePlayerModule.meta.tracklist) {
      const trackListItem =
        this.storePlayerModule.meta.tracklist[
          binarySearch(
            this.storePlayerModule.meta.tracklist,
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
}
</script>

<style scoped>
#logo {
  background-image: url(/assets/static/logos/creal.svg);
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
