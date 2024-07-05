<template>
  <li
    class="flex flex-col gap-1 rounded-lg bg-gray-900 p-4 hover:bg-gray-950 lg:gap-2"
  >
    <img
      v-if="coverUrl !== ''"
      alt="Cover image."
      class="h-64 w-64 rounded"
      crossorigin="anonymous"
      :src="coverUrl"
    />
    <div v-else class="flex h-64 w-64 items-center justify-center">
      <div class="h-16 w-16">
        <VioLoaderIndicatorPing />
      </div>
    </div>
    <strong class="line-clamp-2 text-left text-2xl leading-tight">
      {{ playlist.name }}
    </strong>
  </li>
</template>

<script setup lang="ts">
import type { Cover, Playlist } from '~/types/player'

interface Props {
  playlist: Playlist
}
const props = withDefaults(defineProps<Props>(), {})

const route = useRoute()
const fireError = useFireError()

// data
const coverUrl = ref('')

// methods
const init = () => {
  if (props.playlist.cover) {
    setCoverUrl(props.playlist.cover)
  } else {
    coverUrl.value = '/player/playlist-cover_default.jpg'
  }
}
const setCoverUrl = async (cover: Cover) => {
  const key =
    PLAYER_PREFIX +
    `${route.query.playlist || ''}${cover.name}.${cover.fileExtension}`
  const {
    data: { value: signedUrl },
  } = await useFetch('/api/player/signed-url', {
    params: { key },
  })

  if (!signedUrl)
    return fireError({ error: new Error('Could not get signed url!') })

  displayImageWhenFullyLoaded(signedUrl)
}
const displayImageWhenFullyLoaded = (src: string) => {
  if (import.meta.server) return

  const img = new Image()

  img.crossOrigin = 'anonymous'
  img.onload = () => {
    coverUrl.value = img.src
  }
  img.src = src
}

// initialization
init()
</script>
