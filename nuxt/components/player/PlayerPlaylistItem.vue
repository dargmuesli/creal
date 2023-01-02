<template>
  <div class="flex select-none">
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="bytesToString(playlistItem.fileSize)"
      @click="onDownloadClick()"
    >
      <IconDownload />
    </button>
    <button
      class="vio-prose-fullwidth max-w-full grow cursor-default py-2 text-left lg:py-3"
      @click="onItemClick"
    >
      {{ playlistItem.fileName.replace(/^cReal - /, '') }}
    </button>
    <button class="ml-3 mr-2 lg:ml-10" title="play" @click="onPlayClick()">
      <IconPlay />
    </button>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from 'pretty-bytes'
import type { PlaylistItem } from '~/types/player'

export interface Props {
  playlistItem: PlaylistItem
}
withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'download'): void
  (e: 'play'): void
}>()

// methods
function bytesToString(bytes: number) {
  return prettyBytes(bytes)
}
function onDownloadClick() {
  emit('download')
}
function onItemClick(event: any) {
  if (event.detail === 2) {
    // double click
    onPlayClick()
  }
}
function onPlayClick() {
  emit('play')
}
</script>
