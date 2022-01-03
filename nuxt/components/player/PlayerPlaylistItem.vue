<template>
  <div class="flex select-none">
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="bytesToString(playlistItem.size)"
      @click="onDownloadClick()"
    >
      <font-awesome-icon :icon="['fas', 'download']" />
    </button>
    <button
      class="cursor-default grow py-2 lg:py-3 text-left"
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
import prettyBytes from 'pretty-bytes'
import { defineComponent, PropType } from '#app'
import { PlaylistItem } from '../../server/api/player/playlists'

export default defineComponent({
  props: {
    playlistItem: {
      required: true,
      type: Object as PropType<PlaylistItem>,
    },
  },
  methods: {
    bytesToString(bytes: number) {
      return prettyBytes(bytes)
    },
    onDownloadClick() {
      this.$emit('download', this.playlistItem)
    },
    onItemClick(event: any) {
      if (event.detail === 2) {
        // double click
        this.onPlayClick()
      }
    },
    onPlayClick() {
      this.$emit('play', this.playlistItem)
    },
  },
})
</script>
