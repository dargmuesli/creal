<template>
  <li class="rounded-lg bg-gray-900 hover:bg-gray-950">
    <div class="flex select-none">
      <button
        class="p-2 lg:p-4"
        :title="bytesToString(playlistItem.fileSize)"
        @click="onDownloadClick()"
      >
        <VioIconDownload />
      </button>
      <button
        class="max-w-full grow cursor-default p-2 text-left lg:p-4"
        @click="onItemClick"
      >
        {{
          playlistItem.fileName
            .replace(/cReal - /, '')
            .split(' - ')
            .reverse()
            .join(' · ')
        }}
      </button>
      <button class="p-2 lg:p-4" title="play" @click="onPlayClick()">
        <VioIconPlay />
      </button>
    </div>
  </li>
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
const onItemClick = (event: MouseEvent) => {
  // double click
  if (event.detail === 2) onPlayClick()
}
const onPlayClick = () => emit('play')
</script>
