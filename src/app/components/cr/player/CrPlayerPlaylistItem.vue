<template>
  <li class="group/track rounded-lg bg-gray-900 hover:bg-[#2b2617]">
    <div class="flex items-center select-none">
      <VioButton
        :aria-label="formatTrackLabel(playlistItem.fileName)"
        :class="
          variant === 'queue'
            ? 'max-w-full grow cursor-default p-3 text-left text-sm'
            : 'max-w-full grow cursor-default p-3 text-left'
        "
        type="button"
        @click="onItemClick"
      >
        {{ formatTrackLabel(playlistItem.fileName) }}
      </VioButton>
      <!--
        File actions are a page-list concern; the player's queue only
        navigates playback, so it renders the row without them. They sit
        between title and play: at rest (lg) they are invisible but keep
        their spot, so the title always starts at the left edge. All action
        buttons share p-3 so they render as uniform squares.
      -->
      <template v-if="variant === 'list'">
        <VioButton
          :aria-label="t('download')"
          class="p-3 transition-opacity lg:opacity-0 lg:group-focus-within/track:opacity-100 lg:group-hover/track:opacity-100"
          :title="bytesToString(playlistItem.fileSize)"
          type="button"
          @click="onDownloadClick()"
        >
          <VioIconDownload />
        </VioButton>
        <VioButton
          :aria-label="t('share')"
          class="p-3 transition-opacity lg:opacity-0 lg:group-focus-within/track:opacity-100 lg:group-hover/track:opacity-100"
          :title="t('share')"
          type="button"
          @click="onShareClick()"
        >
          <VioIconShare />
        </VioButton>
      </template>
      <VioButton
        :aria-label="isCurrent ? t('playing') : t('play')"
        class="p-3"
        :title="isCurrent ? t('playing') : t('play')"
        type="button"
        @click="onPlayClick()"
      >
        <span
          v-if="isCurrent"
          class="eq bg-vio-primary-bg h-5 w-5 rounded-full text-gray-900 md:h-6 md:w-6"
          :class="{ 'eq-paused': store.playerData.isPaused }"
        >
          <span class="eq-bar" />
          <span class="eq-bar" />
          <span class="eq-bar" />
        </span>
        <VioIconPlay v-else />
      </VioButton>
    </div>
  </li>
</template>

<script setup lang="ts">
import prettyBytes from 'pretty-bytes'

const store = useStore()

const {
  playlistItem,
  variant = 'list',
  isCurrent = false,
} = defineProps<{
  playlistItem: PlaylistItem
  // list: page track list with file actions; queue: compact player row.
  variant?: 'list' | 'queue'
  // The track the player is currently on (page list only; the queue shows
  // only the tracks after the current one).
  isCurrent?: boolean
}>()

const emit = defineEmits<{
  download: []
  play: []
  share: []
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
const onShareClick = () => emit('share')
</script>

<i18n lang="yaml">
de:
  download: herunterladen
  play: abspielen
  playing: läuft
  share: Link kopieren
en:
  download: download
  play: play
  playing: playing
  share: Copy link
</i18n>

<style scoped>
/* Animated equalizer bars shown on the current track's play button. */
/* stylelint-disable plugin/no-unsupported-browser-features */
.eq {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.eq-bar {
  height: 10px;
  width: 2px;
  background: currentcolor;
  border-radius: 1px;
  transform-origin: bottom;
  animation: eq-bounce 0.9s ease-in-out infinite;
}

.eq-bar:nth-child(2) {
  animation-delay: 0.3s;
}

.eq-bar:nth-child(3) {
  animation-delay: 0.6s;
}

.eq-paused .eq-bar {
  animation: none;
  transform: scaleY(0.6);
}

@keyframes eq-bounce {
  0%,
  100% {
    transform: scaleY(0.3);
  }

  50% {
    transform: scaleY(1);
  }
}
</style>
