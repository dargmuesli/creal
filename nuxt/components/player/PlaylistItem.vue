<template>
  <div class="flex select-none">
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="bytesToString(playlistItem.size)"
      @click="download()"
    >
      <font-awesome-icon :icon="['fas', 'download']" />
    </button>
    <button
      class="cursor-default flex-grow py-2 lg:py-3 text-left"
      @click="itemClick"
    >
      {{ playlistItem.name.replace(/^cReal - /, '') }}
    </button>
    <button class="ml-3 lg:ml-10 mr-2" title="play" @click="play()">
      <font-awesome-icon :icon="['fas', 'play']" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import prettyBytes from 'pretty-bytes'

import { PLAYER_PREFIX, PlaylistItemData } from '../../api/player/playlists'

@Component({})
export default class extends Vue {
  @Prop({ type: Object, required: true })
  readonly playlistItem!: PlaylistItemData

  @Prop({ type: Function, required: true })
  readonly setSourceFunction!: Function

  async getSignedUrl() {
    const key =
      PLAYER_PREFIX +
      (this.$route.query.playlist ? this.$route.query.playlist + '/' : '') +
      this.playlistItem.name +
      '.' +
      this.playlistItem.extension
    return await this.$axios.$get('/player/signedUrl', {
      params: new URLSearchParams({ key }),
    })
  }

  async download() {
    const link = document.createElement('a')
    link.setAttribute('href', await this.getSignedUrl())
    link.setAttribute('download', '123.mp3') // This value is never shown to the user in current browser implementations.
    link.click()
  }

  async play() {
    this.setSourceFunction(this.playlistItem, await this.getSignedUrl())
  }

  itemClick(event: any) {
    if (event.detail === 2) {
      // double click
      this.play()
    }
  }

  bytesToString(bytes: number) {
    return prettyBytes(bytes)
  }
}
</script>
