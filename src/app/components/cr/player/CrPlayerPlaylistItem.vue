<template>
  <li class="rounded-lg bg-gray-900 hover:bg-gray-950">
    <div class="flex select-none">
      <VioButton
        :aria-label="t('download')"
        class="p-4"
        :title="bytesToString(playlistItem.fileSize)"
        type="button"
        @click="onDownloadClick()"
      >
        <VioIconDownload />
      </VioButton>
      <VioButton
        :aria-label="
          playlistItem.fileName
            .replace(/cReal - /, '')
            .split(' - ')
            .reverse()
            .join(' · ')
        "
        class="max-w-full grow cursor-default p-2 text-left lg:p-4"
        type="button"
        @click="onItemClick"
      >
        {{
          playlistItem.fileName
            .replace(/cReal - /, '')
            .split(' - ')
            .reverse()
            .join(' · ')
        }}
      </VioButton>
      <VioButton
        :aria-label="t('play')"
        class="p-4"
        title="play"
        type="button"
        @click="onPlayClick()"
      >
        <VioIconPlay />
      </VioButton>
    </div>
  </li>
</template>

<script setup lang="ts">
import prettyBytes from 'pretty-bytes'

const { playlistItem } = defineProps<{
  playlistItem: PlaylistItem
}>()

const emit = defineEmits<{
  download: []
  play: []
}>()

const { t } = useI18n()

// methods
const bytesToString = (bytes: number) => prettyBytes(bytes)
const onDownloadClick = () => emit('download')
const onItemClick = (event?: MouseEvent) => {
  if (!event) return

  // double click
  if (event.detail === 2) onPlayClick()
}
const onPlayClick = () => emit('play')
</script>

<i18n lang="yaml">
de:
  download: herunterladen
  play: abspielen
en:
  download: download
  play: play
</i18n>
