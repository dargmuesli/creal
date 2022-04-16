<template>
  <div class="flex select-none">
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="bytesToString(playlistItem.size)"
      @click="onDownloadClick()"
    >
      <IconDownload />
    </button>
    <button
      class="creal-prose-fullwidth max-w-full grow cursor-default py-2 text-left lg:py-3"
      @click="onItemClick"
    >
      {{ playlistItem.name.replace(/^cReal - /, '') }}
    </button>
    <button class="ml-3 mr-2 lg:ml-10" title="play" @click="onPlayClick()">
      <IconPlay />
    </button>
  </div>
</template>

<script lang="ts">
import prettyBytes from 'pretty-bytes'
import { defineComponent, PropType } from '#app'
import { PlaylistItem } from '~/types/playlist'

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
