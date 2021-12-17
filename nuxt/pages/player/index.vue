<template>
  <div class="container mx-auto">
    <section>
      <h1>{{ title }}</h1>
      <div class="bg-gray-900 grow p-4 rounded">
        <div v-if="$fetchState.pending" class="text-center">
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
          {{ $t('globalLoading') }}
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
              class="m-2 max-w-xxs min-w-xxs"
            >
              <AppLink
                class="block h-full"
                :title="collection.name"
                :to="getPlaylistLink(collection.name)"
              >
                <PlayerPlaylist class="h-full" :playlist="collection" />
              </AppLink>
            </li>
          </ul>
          <ul v-if="playlistData.items.length > 0" class="list-none">
            <li
              v-for="playlistItem of playlistData.items"
              :key="playlistItem.name"
              class="border-b border-gray-800 first:border-t hover:bg-gray-800"
            >
              <PlayerPlaylistItem
                :class="{
                  'text-yellow-500':
                    $route.query.playlist &&
                    $route.query.playlist ===
                      storePlayerModule.currentTrackPlaylistName &&
                    playlistItem.name === storePlayerModule.currentTrackName,
                }"
                :playlist-item="playlistItem"
                @download="onPlaylistItemDownload"
                @play="onPlaylistItemSelect"
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
            {{ $t('itemsNone') }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import { Route } from 'vue-router'

import {
  PLAYER_PREFIX,
  AxiosPlaylist,
  Playlist,
  PlaylistItem,
  mergeByKey,
} from '../../server/api/player/playlists'
import PlayerModule from '~/store/modules/PlayerModule'

import { defineComponent } from '#app'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      playlistData: null as null | Playlist,
      storePlayerModule: getModule(PlayerModule, this.$store),
      title: 'Player',
    }
  },
  async fetch() {
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

    // Try to select and play track as indicated by query parameter.
    const queryTrack = this.$route.query.track

    if (playlistData && typeof queryTrack === 'string') {
      for (const playlistItem of playlistData.items) {
        if (playlistItem.name === queryTrack) {
          this.onPlaylistItemSelect(playlistItem, false)
        }
      }
    }
  },
  fetchOnServer: false,
  head() {
    const title = this.titleHead() as string
    const description = this.$t('description') as string

    return {
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$baseUrl + this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
      ],
      title,
    }
  },
  watch: {
    $route(val: Route, valOld: Route) {
      if (val.query.playlist !== valOld.query.playlist) {
        this.$fetch()
      }
    },
  },
  methods: {
    titleHead() {
      return this.storePlayerModule.currentTrackName &&
        !this.storePlayerModule.isPlayerPaused
        ? this.storePlayerModule.currentTrackName
        : this.title
    },

    // ///////////////////////////////////////////////////////////////////////////
    // Util //////////////////////////////////////////////////////////////////////

    async getSignedUrl(playlistItem: PlaylistItem) {
      const key =
        PLAYER_PREFIX +
        (this.$route.query.playlist ? this.$route.query.playlist + '/' : '') +
        playlistItem.name +
        '.' +
        playlistItem.extension
      return await this.$axios.$get('/player/signed-url', {
        params: new URLSearchParams({ key }),
      })
    },
    serializeQueryString(object: any) {
      const playlistLinkParts: Array<string> = []

      for (const [key, value] of Object.entries(object)) {
        playlistLinkParts.push(value === null ? key : `${key}=${value}`)
      }

      return `?${playlistLinkParts.join('&')}`
    },

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
    },

    // ///////////////////////////////////////////////////////////////////////////
    // Events ////////////////////////////////////////////////////////////////////

    async onPlaylistItemDownload(playlistItem: PlaylistItem) {
      const link = document.createElement('a')
      link.setAttribute('href', await this.getSignedUrl(playlistItem))
      link.setAttribute('download', '123.mp3') // This value is never shown to the user in current browser implementations.
      link.click()
    },
    async onPlaylistItemSelect(
      playlistItem: PlaylistItem,
      isManuallySet = true
    ) {
      this.storePlayerModule.setIsPlayerVisible(true)
      this.storePlayerModule.setCurrentTrackName(playlistItem.name)
      this.storePlayerModule.setCurrentTrackPlaylistName(
        typeof this.$route.query.playlist === 'string'
          ? decodeURIComponent(this.$route.query.playlist)
          : null
      )

      // Activate only the newly selected playlist item.
      if (!this.playlistData) {
        return
      }

      // Set query parameter.
      const queryObject = JSON.parse(JSON.stringify(this.$route.query))
      const queryObjectTrack = playlistItem.name

      // Conditionally update track query parameter.
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
        this.storePlayerModule.setCurrentTrackMeta(
          await this.$axios.$get('/player/get-object', {
            params: new URLSearchParams({ key }),
          })
        )
      } else {
        this.storePlayerModule.setCurrentTrackMeta(null)
        this.storePlayerModule.setCurrentTrackDescription(null)
      }

      this.$nuxt.$emit(
        'plyr',
        {
          type: 'audio',
          sources: [
            {
              src: await this.getSignedUrl(playlistItem),
              type: 'audio/mp3',
            },
          ],
        },
        isManuallySet
      )
    },
  },
})
</script>

<i18n lang="yml">
de:
  description: Mixe von DJ cReal anhören.
  itemsNone: Keine Elemente gefunden.
en:
  description: Listen to mixes by DJ cReal.
  itemsNone: No items found.
</i18n>
