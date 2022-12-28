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
      class="vio-prose-fullwidth max-w-full grow cursor-default py-2 text-left lg:py-3"
      @click="onItemClick"
    >
      {{ playlistItem.name.replace(/^cReal - /, '') }}
    </button>
    <button class="ml-3 mr-2 lg:ml-10" title="play" @click="onPlayClick()">
      <IconPlay />
    </button>
  </div>
</template>

<script setup lang="ts">
import prettyBytes from 'pretty-bytes'
import type { PlaylistItem } from '~/types/playlist'

export interface Props {
  playlistItem: PlaylistItem
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  (e: 'download', playlistItem: PlaylistItem): void
  (e: 'play', playlistItem: PlaylistItem): void
}>()

// methods
function bytesToString(bytes: number) {
  return prettyBytes(bytes)
}
function onDownloadClick() {
  emit('download', props.playlistItem)
}
function onItemClick(event: any) {
  if (event.detail === 2) {
    // double click
    onPlayClick()
  }
}
function onPlayClick() {
  emit('play', props.playlistItem)
}
</script>
