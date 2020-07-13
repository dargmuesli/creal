<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>Player</h1>
      <div class="flex flex-col mb-2">
        <div class="bg-gray-900 flex-grow p-2">
          <ul class="flex flex-wrap justify-center list-none">
            <li
              v-for="playlist in playlists"
              :key="playlist.name"
              class="max-w-xs m-2 mb-4"
            >
              <a :alt="playlist.name" :href="getPlaylistLink(playlist.name)">
                <Playlist :playlist="playlist" />
              </a>
            </li>
          </ul>
          <ul class="list-none">
            <li
              v-for="playlistItem in playlistItems"
              :key="playlistItem.name"
              class="border-b border-gray-800 first:border-t hover:bg-gray-800"
            >
              <PlaylistItem
                :playlist-item="playlistItem"
                :set-source-function="setSource"
              />
            </li>
          </ul>
        </div>
      </div>
      <vue-plyr ref="plyr" class="fixed bottom-0 left-0 right-0">
        <audio />
      </vue-plyr>
    </section>
    <!-- player below is for spacing (invisible) -->
    <vue-plyr class="invisible">
      <audio />
    </vue-plyr>
  </div>
</template>

<script lang="ts">
import get from 'lodash.get'
import merge from 'lodash.mergewith'
import { Component, Vue } from 'nuxt-property-decorator'

import Playlist from '~/components/player/Playlist.vue'
import PlaylistItem from '~/components/player/PlaylistItem.vue'
import Button from '~/components/Button.vue'

interface AsyncData {
  playlists: object | undefined
  playlistItems: object | undefined
}

interface AxiosPlaylistData {
  playlists: object
  nextContinuationToken: string
}

// function flattenPlaylists(object: { [key: string]: any }) {
//   const returnObject: any = {}

//   for (const [key, value] of Object.entries(object)) {
//     if (Array.isArray(value)) {
//       returnObject[key] = value
//     } else if (typeof value === 'object') {
//       const innerObject = flattenPlaylists(value)

//       for (const [iKey, iValue] of Object.entries(innerObject)) {
//         returnObject[`${key}/${iKey}`] = iValue
//       }
//     }
//   }

//   return returnObject
// }

@Component({
  components: {
    Button,
    Playlist,
    PlaylistItem,
  },
})
export default class extends Vue {
  playlists?: Array<object>

  get player() {
    return (this.$refs.plyr as any).player
  }

  async asyncData({
    $axios,
    query,
  }: {
    $axios: any
    query: any
  }): Promise<AsyncData> {
    let continuationToken
    const playlistsObject: object = {}

    try {
      do {
        const playlistData: AxiosPlaylistData = await $axios.$get(
          '/player/playlists',
          {
            params: new URLSearchParams(
              merge(
                {},
                {
                  ...(continuationToken !== undefined && {
                    'continuation-token': continuationToken,
                  }),
                  ...(query.playlist !== undefined && {
                    prefix: query.playlist,
                  }),
                }
              )
            ),
          }
        )

        merge(
          playlistsObject,
          playlistData.playlists /* flattenPlaylists(playlistData.playlists) */
        )
        continuationToken = playlistData.nextContinuationToken
      } while (continuationToken !== undefined)
    } catch (e) {
      return {
        playlists: undefined,
        playlistItems: undefined,
      }
    }

    const playlists = []
    let playlistItems

    const playlistsOrPlaylistItems =
      query.playlist !== undefined
        ? get(
            playlistsObject,
            query.playlist.split('/').join('/items/').split('/'),
            { items: {} }
          ).items
        : playlistsObject

    if (Array.isArray(playlistsOrPlaylistItems)) {
      playlistItems = playlistsOrPlaylistItems
    } else {
      for (const [key, value] of Object.entries(playlistsOrPlaylistItems)) {
        playlists.push({ name: key, items: value })
      }
    }

    return {
      playlists,
      playlistItems,
    }
  }

  getPlaylistLink(name: string) {
    const queryObject = JSON.parse(JSON.stringify(this.$route.query))
    const playlistLinkParts: Array<string> = []

    queryObject.playlist = encodeURIComponent(
      [queryObject.playlist, name]
        .filter(Boolean) // prevent initial join character
        .join('/')
    )

    for (const [key, value] of Object.entries(queryObject)) {
      playlistLinkParts.push(value === null ? key : `${key}=${value}`)
    }

    return `?${playlistLinkParts.join('&')}`
  }

  setSource(url: URL) {
    this.player.config.controls = [
      'play-large',
      'play',
      'progress',
      'current-time',
      // 'mute',
      // 'volume',
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
  }
}
</script>
