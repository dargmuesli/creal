<template>
  <!--
    Persistent player. On lg+ it is a fixed right sidebar with the metadata
    block, the queue, and the Video.js neutral skin, whose corner radius is
    squared to the panel's via the --media-border-radius var. Below lg it is
    a compact fixed bottom bar: a thin progress line and a single line with
    play/pause and the track name.
  -->
  <div
    class="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-gray-950 text-gray-100 shadow-2xl lg:inset-x-auto lg:top-0 lg:right-0 lg:bottom-0 lg:w-96 lg:border-t-0 lg:border-l"
    :class="{ hidden: !store.playerData.isVisible }"
  >
    <!--
      The mobile mini-player has no seek bar, so a thin line shows where the
      track is. timeupdate fires ~4x/s; the linear transition smooths the
      steps.
    -->
    <div class="h-0.5 w-full bg-white/10 lg:hidden">
      <div
        class="bg-vio-primary-bg h-full transition-[width] duration-300 ease-linear"
        :style="{ width: `${progress * 100}%` }"
      />
    </div>
    <div class="flex h-full flex-col gap-3 p-3 lg:gap-4 lg:p-5">
      <div
        v-if="store.playerData.currentTrack?.fileName"
        class="hidden min-w-0 lg:block"
      >
        <div class="flex items-center gap-3">
          <img
            alt=""
            class="h-14 w-14 shrink-0 rounded"
            crossorigin="anonymous"
            :src="coverUrl"
          />
          <div class="min-w-0">
            <p
              class="text-xs font-semibold tracking-wide text-gray-500 uppercase"
            >
              {{ t('nowPlaying') }}
            </p>
            <h2 class="truncate text-base font-semibold lg:text-lg">
              {{ formatTrackLabel(store.playerData.currentTrack.fileName) }}
            </h2>
            <p
              v-if="store.playerData.currentTrack.meta?.description"
              class="truncate text-sm text-gray-400"
            >
              {{ store.playerData.currentTrack.meta.description }}
            </p>
          </div>
        </div>
      </div>
      <!--
        The queue: the tracks that come after the current one ("up next").
        The current track itself lives in the now-playing header above, so
        the queue never duplicates it. Only rendered on the sidebar (lg+);
        the mobile bottom bar stays a compact mini-player. The list scrolls
        independently so the player stays pinned to the bottom.
      -->
      <div
        v-if="store.playerData.currentPlaylist?.items.length"
        class="hidden min-h-0 flex-1 flex-col lg:mt-2 lg:flex"
      >
        <p
          class="text-xs font-semibold tracking-wide text-gray-500 uppercase lg:mb-2"
        >
          {{ t('upNext') }}
        </p>
        <ul
          v-if="upNextItems.length"
          class="flex flex-1 flex-col gap-2 overflow-y-auto"
        >
          <!--
            The queue is a playback action, not a navigation: playing from
            it must not pull the user off the page they are on.
          -->
          <CrPlayerPlaylistItem
            v-for="playlistItem of upNextItems"
            :key="playlistItem.fileName"
            :playlist-item="playlistItem"
            variant="queue"
            @play="
              play(playlistItem, store.playerData.currentPlaylistPath, true)
            "
          />
        </ul>
      </div>
      <!--
        Mobile mini-player: a single line with play/pause and the track name.
        Tapping play is a user gesture, so it doubles as the CTA when
        autoplay was blocked (the overlay CTA above only exists on lg+).
      -->
      <div
        v-if="store.playerData.currentTrack?.fileName"
        class="flex min-w-0 items-center gap-3 lg:hidden"
      >
        <button
          :aria-label="store.playerData.isPaused ? t('play') : t('pause')"
          class="bg-vio-primary-bg text-vio-primary-text flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow ring-1 ring-black/10 transition hover:brightness-95"
          type="button"
          @click="onTogglePlay()"
        >
          <PlayIcon v-if="store.playerData.isPaused" class="h-5 w-5" />
          <PauseIcon v-else class="h-5 w-5" />
        </button>
        <img
          alt=""
          class="h-9 w-9 shrink-0 rounded"
          crossorigin="anonymous"
          :src="coverUrl"
        />
        <p class="min-w-0 flex-1 truncate text-sm font-semibold">
          {{ formatTrackLabel(store.playerData.currentTrack.fileName) }}
        </p>
      </div>
      <ClientOnly>
        <div class="relative hidden lg:mt-auto lg:block">
          <audio-player>
            <audio-neutral-skin
              style="
                /* stylelint-disable-next-line plugin/no-unsupported-browser-features, custom-property-empty-line-before */
                --media-border-radius: 0px;
              "
            >
              <audio
                ref="audioRef"
                crossorigin="anonymous"
                @ended="onEnded"
                @loadedmetadata="onLoadedMetadata"
                @pause="onPause"
                @play="onPlay"
                @timeupdate="onTimeUpdate"
              />
            </audio-neutral-skin>
          </audio-player>
          <!--
            Shown only when the browser blocked the automatic play() call
            (NotAllowedError), which happens on a fresh page load such as
            opening a share link without a user gesture. The player's own play
            control is hidden beneath this overlay, so there is a single,
            unambiguous way to start playback. The <audio> element stays
            mounted (only visually covered) so audioRef is still available.
            Pressing this is a user gesture, so play() succeeds and the
            `play` event clears the overlay, revealing the live player.
          -->
          <button
            v-if="wasPlaybackBlocked"
            :aria-label="t('playCta')"
            class="absolute inset-0 z-10 flex items-center justify-center bg-gray-950 text-gray-100"
            :title="t('playCta')"
            type="button"
            @click="onBlockedPlayClick()"
          >
            <span
              class="bg-vio-primary-bg text-vio-primary-text flex h-12 w-12 items-center justify-center rounded-full shadow-lg ring-1 ring-black/10 transition hover:brightness-95"
            >
              <VioIconPlay classes="h-6 w-6" />
            </span>
          </button>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/outline'

const store = useStore()
const { t } = useI18n()
const { play } = usePlayer()

// data
const audioRef = ref<HTMLAudioElement>()
const wasPlaybackBlocked = ref(false)
// Time to seek to once the current source's metadata is available, or
// undefined when the track should start from the beginning.
const pendingSeekTime = ref<number>()
// Playback progress (0..1) for the mobile mini-player's thin progress line.
const progress = ref(0)
// Shown in the now-playing header (lg+) and the mobile mini-player. Falls
// back to the default cover until the current track's cover is resolved (or
// when the track has none).
const DEFAULT_COVER_URL = '/player/playlist-cover_default.jpg'
const coverUrl = ref(DEFAULT_COVER_URL)

// computations
// The queue shows only the tracks that come after the current one; the
// current track is represented by the now-playing header, not the list.
const upNextItems = computed(() => {
  const { currentPlaylist, currentTrack } = store.playerData

  if (!currentPlaylist?.items.length || !currentTrack) return []

  const index = currentPlaylist.items.findIndex(
    (item) => item?.fileName === currentTrack.fileName,
  )

  return currentPlaylist.items.slice(index + 1)
})

// methods
const binarySearch = <A, B>(
  ar: B[],
  el: A,
  compareFn: (a: A, b: B) => number,
) => {
  let m = 0
  let n = ar.length - 1

  while (m <= n) {
    const k = (n + m) >> 1

    if (!ar[k]) break

    const cmp = compareFn(el, ar[k])

    if (cmp > 0) {
      m = k + 1
    } else if (cmp < 0) {
      n = k - 1
    } else {
      return k
    }
  }

  return m - 1
}
const trackListItemComparator = (time: number, b: TrackListItem) =>
  time - b.startSeconds

const closeAllow = () => (window.onbeforeunload = () => {})

const closeProtect = () =>
  (window.onbeforeunload = () =>
    'The music will stop playing if you navigate away.')

// --- Position persistence -------------------------------------------------
// Writes at most this often from timeupdate, so we don't hit localStorage on
// every tick while the exact spot is still captured on pause and pagehide.
const POSITION_WRITE_INTERVAL_MS = 5000
// A track paused within this distance of its end is treated as finished, so a
// reload starts it from the beginning instead of resuming the final seconds.
const RESUME_END_MARGIN_S = 3
let lastPositionWrite = 0

// Identifies the current track for persistence, derived from the route
// (playlist path + track name) so a reload re-selects the same track.
const getTrackKey = (): string | undefined => {
  const { currentPlaylistPath, currentTrack } = store.playerData

  if (!currentTrack?.fileName) return

  return getTrackPath(currentPlaylistPath, currentTrack.fileName)
}
const writePosition = () => {
  const trackKey = getTrackKey()
  const time = audioRef.value?.currentTime

  if (!trackKey || time == null) return

  writePlaybackPosition(trackKey, time)
}
const writePositionThrottled = () => {
  const now = Date.now()

  if (now - lastPositionWrite < POSITION_WRITE_INTERVAL_MS) return

  lastPositionWrite = now
  writePosition()
}
// Applying the saved position here (rather than in the source watch) is
// necessary because seeking requires the new source's metadata to be loaded.
const onLoadedMetadata = () => {
  const seekTime = pendingSeekTime.value

  pendingSeekTime.value = undefined
  // A new source starts from the beginning (or the pending seek below).
  progress.value = 0

  const audio = audioRef.value

  if (seekTime == null || !audio) return
  if (!Number.isFinite(seekTime) || seekTime <= 0) return
  if (
    Number.isFinite(audio.duration) &&
    audio.duration > 0 &&
    seekTime >= audio.duration - RESUME_END_MARGIN_S
  ) {
    return
  }

  audio.currentTime = seekTime
}

const onEnded = () => {
  closeAllow()
  // A finished track must not resume on reload.
  clearPlaybackPosition()
  playAdjacent(1)
}
// Plays the track `delta` places away from the current one in the playback
// context (queue). Used for auto-advance on ended and for the OS
// next/previous controls.
const playAdjacent = (delta: number) => {
  const { currentPlaylist, currentTrack } = store.playerData

  if (!currentPlaylist?.items.length || !currentTrack) return

  const currentIndex = currentPlaylist.items.findIndex(
    (item) => item?.fileName === currentTrack.fileName,
  )
  const nextTrack = currentPlaylist.items[currentIndex + delta]

  if (nextTrack) {
    play(nextTrack, store.playerData.currentPlaylistPath)
  }
}
const onPause = () => {
  store.playerData.isPaused = true
  closeAllow()
  writePosition()
  setMediaSessionState('paused')
}
const onPlay = () => {
  store.playerData.isPaused = false
  wasPlaybackBlocked.value = false
  setMediaSessionState('playing')
}
// The user explicitly clicked the "start playback" CTA, so this is a valid
// user gesture and play() will not be blocked by the autoplay policy.
const onBlockedPlayClick = () => {
  if (!audioRef.value) return

  wasPlaybackBlocked.value = false
  closeProtect()

  audioRef.value.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      wasPlaybackBlocked.value = true
    }
  })
}
// Toggles playback from the mobile mini-player. A tap is a user gesture, so
// it also unblocks playback after an autoplay-blocked start.
const onTogglePlay = () => {
  const audio = audioRef.value
  if (!audio) return

  if (audio.paused) {
    wasPlaybackBlocked.value = false
    closeProtect()

    audio.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        wasPlaybackBlocked.value = true
      }
    })
  } else {
    audio.pause()
  }
}
const onTimeUpdate = () => {
  writePositionThrottled()

  const audio = audioRef.value

  if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
    progress.value = audio.currentTime / audio.duration
  }

  if (!store.playerData.currentTrack?.meta?.tracklist || !audioRef.value) return

  const trackListItem =
    store.playerData.currentTrack.meta.tracklist[
      binarySearch(
        store.playerData.currentTrack.meta.tracklist,
        audioRef.value.currentTime,
        trackListItemComparator,
      )
    ]

  const currentTrackDescription = trackListItem
    ? trackListItem.artistName + ' - ' + trackListItem.songName
    : ''

  if (
    store.playerData.currentTrack.meta.description !== currentTrackDescription
  ) {
    store.playerData.currentTrack.meta.description = currentTrackDescription
  }
}
// lifecycle
watch(
  () => store.playerData.sourceUrl,
  (current) => {
    if (current && audioRef.value) {
      // If this track was played before, resume where the user left off; the
      // seek itself is applied once the new source's metadata is available.
      const trackKey = getTrackKey()

      pendingSeekTime.value = trackKey
        ? readPlaybackPosition(trackKey)
        : undefined

      audioRef.value.src = current
      audioRef.value.play().catch((error: unknown) => {
        // A fresh page load (e.g. opening a share link) has no user gesture,
        // so the browser's autoplay policy rejects play() with
        // NotAllowedError. Surface a "start playback" CTA instead of failing
        // silently.
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          wasPlaybackBlocked.value = true
          // Nothing is playing: keep the pause state honest (the mobile
          // mini-player's icon reads it).
          store.playerData.isPaused = true
          closeAllow()
        }
      })
      store.playerData.isPaused = false
      closeProtect()
    }
  },
)

// Resolves the current track's cover to a signed URL for display. The stale
// check after the await guards against fast track switching (a slow cover
// must not land on the next track).
watch(
  () => store.playerData.currentTrack,
  async (track) => {
    coverUrl.value = DEFAULT_COVER_URL

    if (!track?.cover) return

    const url = await getCoverSignedUrl({
      cover: track.cover,
      playlistPath: store.playerData.currentPlaylistPath,
    })

    if (url && store.playerData.currentTrack?.fileName === track.fileName) {
      coverUrl.value = url
    }
  },
  { immediate: true },
)

// --- Media Session ---------------------------------------------------------
// Exposes the player to the OS (lock screen, media keys, notification).
// Everything is feature-detected, and an unsupported action is skipped
// instead of aborting the rest of the setup.
const setMediaSessionState = (state: 'playing' | 'paused') => {
  if (!import.meta.client || !('mediaSession' in navigator)) return

  navigator.mediaSession.playbackState = state
}
const updateMediaSessionMetadata = () => {
  // import.meta.client: the metadata watcher is immediate and therefore also
  // runs during server rendering, where navigator does not exist.
  if (!import.meta.client || !('mediaSession' in navigator)) return
  const track = store.playerData.currentTrack
  if (!track?.fileName) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: formatTrackLabel(track.fileName),
    artist: SITE_NAME,
    album: store.playerData.currentPlaylist?.name,
    artwork: [{ src: coverUrl.value, sizes: '512x512' }],
  })
}
const setupMediaSession = () => {
  if (!import.meta.client || !('mediaSession' in navigator)) return

  const setHandler = (
    action: MediaSessionAction,
    handler: MediaSessionActionHandler,
  ) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler)
    } catch {
      // action unsupported on this browser, skip
    }
  }

  setHandler('play', () => {
    audioRef.value?.play().catch(() => {})
  })
  setHandler('pause', () => audioRef.value?.pause())
  setHandler('previoustrack', () => playAdjacent(-1))
  setHandler('nexttrack', () => playAdjacent(1))
  setHandler('seekto', (details) => {
    const audio = audioRef.value

    if (details.seekTime != null && audio && Number.isFinite(audio.duration)) {
      audio.currentTime = details.seekTime
    }
  })
}
// The metadata follows the track (title, album) and the cover (artwork).
watch(() => store.playerData.currentTrack, updateMediaSessionMetadata, {
  immediate: true,
})
watch(coverUrl, updateMediaSessionMetadata)

// The position is also written on pagehide (reload, navigation, close), so the
// most recent spot is captured even if neither a pause nor the throttled
// timeupdate write fired recently.
const onPageHide = () => {
  writePosition()
}
// Space toggles playback, arrow keys seek +-5s. Keys are ignored while a
// form field, link, button, or slider has focus so page interactions (and
// the skin's own seek bar) keep working, and with modifier keys so browser
// and OS shortcuts are untouched.
const isKeyTargetInteractive = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  !!target.closest(
    'input, textarea, select, button, a, [role="slider"], [contenteditable="true"]',
  )
const onKeyDown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return
  if (isKeyTargetInteractive(event.target)) return

  const audio = audioRef.value
  if (!audio) return

  switch (event.key) {
    case ' ':
      event.preventDefault()
      onTogglePlay()
      break
    case 'ArrowRight':
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
      }
      break
    case 'ArrowLeft':
      audio.currentTime = Math.max(0, audio.currentTime - 5)
      break
  }
}
onMounted(() => {
  window.addEventListener('pagehide', onPageHide)
  window.addEventListener('keydown', onKeyDown)
  setupMediaSession()
})
onBeforeUnmount(() => {
  window.removeEventListener('pagehide', onPageHide)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<i18n lang="yaml">
de:
  nowPlaying: Jetzt läuft
  pause: pause
  play: abspielen
  playCta: Wiedergabe starten
  upNext: Als Nächstes
en:
  nowPlaying: Now playing
  pause: pause
  play: play
  playCta: Start playback
  upNext: Up next
</i18n>
