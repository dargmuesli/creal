<template>
  <div
    class="flex select-none"
    :class="{ 'text-yellow-500': playlistItem.active }"
  >
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="bytesToString(playlistItem.size)"
      @click="onDownloadClick()"
    >
      <font-awesome-icon :icon="['fas', 'download']" />
    </button>
    <button
      class="cursor-default flex-grow py-2 lg:py-3 text-left"
      @click="onItemClick"
    >
      {{ playlistItem.name.replace(/^cReal - /, '') }}
    </button>
    <button class="ml-3 lg:ml-10 mr-2" title="play" @click="onPlayClick()">
      <font-awesome-icon :icon="['fas', 'play']" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import prettyBytes from 'pretty-bytes'

import { PlaylistItem } from '../../api/player/playlists'

@Component({})
export default class extends Vue {
  @Prop({ type: Object, required: true })
  readonly playlistItem!: PlaylistItem

  bytesToString(bytes: number) {
    return prettyBytes(bytes)
  }

  onDownloadClick() {
    this.$emit('download', this.playlistItem)
  }

  onItemClick(event: any) {
    if (event.detail === 2) {
      // double click
      this.onPlayClick()
    }
  }

  onPlayClick() {
    this.$emit('play', this.playlistItem)
  }
}
</script>
