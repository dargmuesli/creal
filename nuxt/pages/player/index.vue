<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>{{ title }}</h1>
      <div class="flex flex-col mb-2">
        <div class="bg-gray-900 flex-grow p-2">
          <div v-if="playlistData !== undefined" class="m-auto w-5/6">
            <h2 v-if="this.$route.query.playlist" class="ml-2">
              {{ this.$route.query.playlist }}
            </h2>
            <ul
              v-if="playlistData.collections.length > 0"
              class="flex flex-wrap justify-center list-none"
            >
              <li
                v-for="collection in playlistData.collections"
                :key="collection.name"
                class="m-2 max-w-xxs min-w-xxs mb-4 overflow-hidden"
              >
                <a
                  class="block h-full"
                  :title="collection.name"
                  :href="getPlaylistLink(collection.name)"
                >
                  <Playlist class="h-full" :playlist="collection" />
                </a>
              </li>
            </ul>
            <ul v-if="playlistData.items.length > 0" class="list-none">
              <li
                v-for="item in playlistData.items"
                :key="item.name"
                class="border-b border-gray-800 first:border-t hover:bg-gray-800"
              >
                <PlaylistItem
                  :playlist-item="item"
                  :set-source-function="setSource"
                />
              </li>
            </ul>
            <div
              v-if="
                playlistData.collections.length === 0 &&
                playlistData.items.length === 0
              "
              class="text-center"
            >
              No items found.
            </div>
          </div>
        </div>
      </div>
      <vue-plyr
        v-if="initialPlay"
        ref="plyr"
        class="fixed bottom-0 left-0 right-0"
        :emit="['pause', 'playing']"
        @pause="onPlyrPause"
        @playing="onPlyrPlaying"
      >
        <audio />
      </vue-plyr>
    </section>
    <!-- player below is for spacing (invisible) -->
    <vue-plyr v-if="initialPlay" class="invisible">
      <audio />
    </vue-plyr>
  </div>
</template>

<script lang="ts">
// import get from 'lodash.get'
import { Component, Vue } from 'nuxt-property-decorator'

import {
  AxiosPlaylistData,
  PlaylistData,
  mergeByKey,
} from '../../api/player/playlists'

@Component({
  head(this: PlayerPage): Object {
    return {
      title: this.titleHead,
    }
  },
})
export default class PlayerPage extends Vue {
  title = 'Player'

  currentTrack: string = ''
  playlistData?: PlaylistData
  plyrPaused: boolean = false
  initialPlay = false

  get player() {
    return (this.$refs.plyr as any).player
  }

  get titleHead() {
    return this.currentTrack !== '' && !this.plyrPaused
      ? this.currentTrack
      : this.title
  }

  async asyncData({
    $axios,
    query,
  }: {
    $axios: any
    query: any
  }): Promise<any> {
    let continuationToken
    const playlistData: PlaylistData = {
      name: 'root',
      collections: [],
      items: [],
      cover: false,
    }

    do {
      const playlistDataPart: AxiosPlaylistData = await $axios.$get(
        '/player/playlists',
        {
          params: new URLSearchParams({
            ...(continuationToken !== undefined && {
              'continuation-token': continuationToken,
            }),
            ...(query.playlist !== undefined && {
              prefix: query.playlist,
            }),
          }),
        }
      )

      mergeByKey(playlistData, playlistDataPart.playlistData, 'name')
      continuationToken = playlistDataPart.nextContinuationToken
    } while (continuationToken !== undefined)

    return { playlistData }
  }

  getPlaylistLink(name: string) {
    const queryObject = JSON.parse(JSON.stringify(this.$route.query))
    const playlistLinkParts: Array<string> = []

    queryObject.playlist = encodeURIComponent(
      [queryObject.playlist, name]
        .filter(Boolean) // Prevent initial join character.
        .join('/')
    )

    for (const [key, value] of Object.entries(queryObject)) {
      playlistLinkParts.push(value === null ? key : `${key}=${value}`)
    }

    return `?${playlistLinkParts.join('&')}`
  }

  onPlyrPause() {
    this.plyrPaused = true
  }

  onPlyrPlaying() {
    this.plyrPaused = false
  }

  setSource(name: string, url: URL) {
    this.initialPlay = true
    const nameParts = name.replace(/\.mp3$/, '').split(' - ')
    this.currentTrack = `${nameParts[1]} · ${nameParts[0]}`
    this.$nextTick().then(() => {
      this.player.config.controls = [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        // 'pip',
        'airplay',
        // 'fullscreen',
      ]
      this.player.source = {
        type: 'audio',
        sources: [
          {
            src: url,
            type: 'audio/mp3',
          },
        ],
      }

      this.player.play()
    })
  }
}
</script>
