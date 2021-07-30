<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>{{ title }}</h1>
      <div class="flex flex-col mb-2">
        <div class="bg-gray-900 flex-grow p-2">
          <div v-if="$fetchState.pending">
            <svg
              class="animate-spin h-16 m-auto text-white w-16"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              title="Loading"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </div>
          <div v-else-if="playlistData" class="m-auto w-5/6">
            <h2 v-if="$route.query.playlist" class="ml-2">
              {{ $route.query.playlist }}
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
                <nuxt-link
                  class="block h-full"
                  :title="collection.name"
                  :to="getPlaylistLink(collection.name)"
                >
                  <PlayerPlaylist class="h-full" :playlist="collection" />
                </nuxt-link>
              </li>
            </ul>
            <ul v-if="playlistData.items.length > 0" class="list-none">
              <li
                v-for="item in playlistData.items"
                :key="item.name"
                class="
                  border-b border-gray-800
                  first:border-t
                  hover:bg-gray-800
                "
              >
                <PlayerPlaylistItem
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
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Route } from 'vue-router'

import {
  PLAYER_PREFIX,
  AxiosPlaylist,
  Playlist,
  PlaylistItem,
  mergeByKey,
} from '../../api/player/playlists'
import PlayerModule from '~/store/modules/PlayerModule'

@Component({
  async fetch(this: PlayerPage) {
    let continuationToken
    const playlistData: Playlist = {
      name: 'root',
      collections: [],
      items: [],
      cover: false,
    }

    do {
      const playlistDataPart: AxiosPlaylist = await this.$axios.$get(
        '/player/playlists',
        {
          params: new URLSearchParams({
            ...(continuationToken !== undefined && {
              'continuation-token': continuationToken,
            }),
            ...((this.$route.query.playlist as any) !== undefined && {
              prefix: this.$route.query.playlist as any,
            }),
          }),
        }
      )

      mergeByKey(playlistData, playlistDataPart.playlistData, 'name')
      continuationToken = playlistDataPart.nextContinuationToken
    } while (continuationToken !== undefined)

    this.playlistData = playlistData
  },
  fetchOnServer: false,
  head(this: PlayerPage): Object {
    return {
      title:
        this.storePlayerModule.currentTrack !== '' &&
        !this.storePlayerModule.isPlayerPaused
          ? this.storePlayerModule.currentTrack
          : this.title,
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
export default class PlayerPage extends Vue {
  title = 'Player'

  playlistData?: Playlist | null = null
  storePlayerModule = getModule(PlayerModule, this.$store)

  @Watch('$route')
  onChildChanged(val: Route, valOld: Route) {
    if (val.query.playlist !== valOld.query.playlist) {
      this.$fetch()
    }
  }

  // get titleHead() {
  //   // return this.title
  //   return this.storePlayerModule.currentTrack !== '' &&
  //     !this.storePlayerModule.isPlayerPaused
  //     ? this.storePlayerModule.currentTrack
  //     : this.title
  // }

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
    this.storePlayerModule.setIsPlayerVisible(true)
    const nameParts = playlistItem.name.split(' - ')
    this.storePlayerModule.setCurrentTrack(
      nameParts.length === 1 ? nameParts[0] : nameParts[1]
    ) // `${nameParts[1]} · ${nameParts[0]}`

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
    const queryObjectTrack = encodeURIComponent(playlistItem.name)

    if (queryObject.track !== queryObjectTrack) {
      queryObject.track = queryObjectTrack

      this.$router.replace({
        path: this.$route.path,
        query: queryObject,
      })
    }

    // Get meta.
    const key =
      PLAYER_PREFIX +
      (this.$route.query.playlist ? this.$route.query.playlist + '/' : '') +
      playlistItem.name +
      '.json'

    if (playlistItem.meta) {
      this.storePlayerModule.setMeta(
        await this.$axios.$get('/player/getObject', {
          params: new URLSearchParams({ key }),
        })
      )
    } else {
      this.storePlayerModule.setMeta(null)
      this.storePlayerModule.setCurrentTrackDescription(null)
    }
    this.$nuxt.$emit('plyr', {
      type: 'audio',
      sources: [
        {
          src: await this.getSignedUrl(playlistItem),
          type: 'audio/mp3',
        },
      ],
    })
  }
}
</script>
