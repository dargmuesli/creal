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
                  @download="onPlaylistItemDownload"
                  @play="onPlaylistItemPlay"
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
      <div class="fixed bottom-0 left-0 right-0">
        <div
          v-if="currentTrack"
          class="bg-white flex flex-col sm:flex-row font-bold justify-evenly text-black"
        >
          <span>
            {{ currentTrack }}
            <span v-if="meta && meta.createdTime" class="font-normal">
              on {{ $moment(meta.createdTime).format('L') }}
            </span>
          </span>
          <span v-if="currentTrackDescription !== ''">
            {{ currentTrackDescription }}
          </span>
          <a
            v-if="meta && meta.mixcloudLink"
            :href="meta.mixcloudLink"
            rel="noopener noreferrer"
            target="_blank"
          >
            <font-awesome-icon :icon="['fab', 'mixcloud']" /> Mixcloud
          </a>
        </div>
        <vue-plyr
          v-if="initialPlay"
          ref="plyr"
          :emit="['pause', 'playing', 'timeupdate']"
          @pause="onPlyrPause"
          @playing="onPlyrPlaying"
          @timeupdate="onPlyrTimeUpdate"
        >
          <audio />
        </vue-plyr>
      </div>
    </section>
    <!-- player below is for spacing (invisible) -->
    <vue-plyr v-if="initialPlay" class="invisible">
      <audio />
    </vue-plyr>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import {
  PLAYER_PREFIX,
  AxiosPlaylist,
  Playlist,
  PlaylistItem,
  PlaylistItemMeta,
  TrackListItem,
  mergeByKey,
} from '../../api/player/playlists'

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
  head(this: PlayerPage): Object {
    return {
      title: this.titleHead,
    }
  },
})
export default class PlayerPage extends Vue {
  title = 'Player'

  currentTrack: string = ''
  currentTrackDescription: string = ''
  playlistData?: Playlist
  meta: PlaylistItemMeta | null = null
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
    const playlistData: Playlist = {
      name: 'root',
      collections: [],
      items: [],
      cover: false,
    }

    do {
      const playlistDataPart: AxiosPlaylist = await $axios.$get(
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

  // ///////////////////////////////////////////////////////////////////////////
  // Util //////////////////////////////////////////////////////////////////////

  async getSignedUrl(playlistItem: PlaylistItem) {
    const key =
      PLAYER_PREFIX +
      (this.$route.query.playlist ? this.$route.query.playlist + '/' : '') +
      playlistItem.name +
      '.' +
      playlistItem.extension
    return await this.$axios.$get('/player/signedUrl', {
      params: new URLSearchParams({ key }),
    })
  }

  serializeQueryString(object: any) {
    const playlistLinkParts: Array<string> = []

    for (const [key, value] of Object.entries(object)) {
      playlistLinkParts.push(value === null ? key : `${key}=${value}`)
    }

    return `?${playlistLinkParts.join('&')}`
  }

  // ///////////////////////////////////////////////////////////////////////////
  // Template //////////////////////////////////////////////////////////////////

  getPlaylistLink(name: string) {
    const queryObject = JSON.parse(JSON.stringify(this.$route.query))

    // Append chosen playlist's name to current playlist path.
    queryObject.playlist = encodeURIComponent(
      [queryObject.playlist, name]
        .filter(Boolean) // Prevent initial join character.
        .join('/')
    )
    delete queryObject.track

    return this.serializeQueryString(queryObject)
  }

  // ///////////////////////////////////////////////////////////////////////////
  // Events ////////////////////////////////////////////////////////////////////

  async onPlaylistItemDownload(playlistItem: PlaylistItem) {
    const link = document.createElement('a')
    link.setAttribute('href', await this.getSignedUrl(playlistItem))
    link.setAttribute('download', '123.mp3') // This value is never shown to the user in current browser implementations.
    link.click()
  }

  async onPlaylistItemPlay(playlistItem: PlaylistItem) {
    this.initialPlay = true
    const nameParts = playlistItem.name.split(' - ')
    this.currentTrack = nameParts[1] // `${nameParts[1]} · ${nameParts[0]}`

    // Activate only the newly selected playlist item.
    if (!this.playlistData) {
      return
    }

    for (let i = 0; i < this.playlistData.items.length; i++) {
      this.playlistData.items[i].active = false
    }

    playlistItem.active = true

    // Set query parameter.
    const queryObject = JSON.parse(JSON.stringify(this.$route.query))

    queryObject.track = encodeURIComponent(playlistItem.name)

    this.$router.replace({
      path: this.$route.path,
      query: queryObject,
    })

    // Get meta.
    const key =
      PLAYER_PREFIX +
      (this.$route.query.playlist ? this.$route.query.playlist + '/' : '') +
      playlistItem.name +
      '.json'

    if (playlistItem.meta) {
      this.meta = await this.$axios.$get('/player/getObject', {
        params: new URLSearchParams({ key }),
      })
    } else {
      this.meta = null
      this.currentTrackDescription = ''
    }

    // Set plyr's source.
    this.$nextTick().then(async () => {
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
            src: await this.getSignedUrl(playlistItem),
            type: 'audio/mp3',
          },
        ],
      }

      this.player.play()
    })
  }

  onPlyrPause() {
    this.plyrPaused = true
  }

  onPlyrPlaying() {
    this.plyrPaused = false
  }

  onPlyrTimeUpdate() {
    if (this.meta && this.meta.tracklist) {
      const trackListItem = this.meta.tracklist[
        binarySearch(
          this.meta.tracklist,
          this.player.media.currentTime,
          trackListItemComparator
        )
      ]

      this.currentTrackDescription = trackListItem
        ? trackListItem.artistName + ' - ' + trackListItem.songName
        : ''
    }
  }
}
</script>
