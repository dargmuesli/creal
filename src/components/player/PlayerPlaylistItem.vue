<template>
  <div class="flex select-none">
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="bytesToString(playlistItem.fileSize)"
      @click="onDownloadClick()"
    >
      <VioIconDownload />
    </button>
    <button
      class="vio-prose-fullwidth max-w-full grow cursor-default py-2 text-left lg:py-3"
      @click="onItemClick"
    >
      {{ playlistItem.fileName.replace(/^cReal - /, '') }}
    </button>
    <button class="ml-3 mr-2 lg:ml-10" title="play" @click="onPlayClick()">
      <VioIconPlay />
    </button>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from 'pretty-bytes'
import type { PlaylistItem } from '~/types/player'

interface Props {
  playlistItem: PlaylistItem
}
withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  download: []
  play: []
}>()

// methods
const bytesToString = (bytes: number) => prettyBytes(bytes)
const onDownloadClick = () => emit('download')
const onItemClick = (event: any) => {
  // double click
  if (event.detail === 2) onPlayClick()
}
const onPlayClick = () => emit('play')
</script>
