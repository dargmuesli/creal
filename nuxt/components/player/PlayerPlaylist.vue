<template>
  <section class="flex w-full flex-col">
    <img
      v-if="coverUrl !== ''"
      alt="Cover image."
      class="rounded"
      :src="coverUrl"
    />
    <div v-else class="m-auto h-16 w-16">
      <LoaderIndicatorPing />
    </div>
    <h1 class="m-0 mt-1 text-left text-2xl leading-tight line-clamp-2">
      {{ playlist.name }}
    </h1>
  </section>
</template>

<script setup lang="ts">
import type { Playlist } from '~/types/player'

export interface Props {
  playlist: Playlist
}
const props = withDefaults(defineProps<Props>(), {})

const route = useRoute()
const fireError = useFireError()

// data
const coverUrl = ref('')

// methods
function init() {
  if (props.playlist.isCoverAvailable) {
    setCoverUrl(props.playlist.name)
  } else {
    coverUrl.value = '/player/playlist-cover_default.jpg'
  }
}
async function setCoverUrl(name: string) {
  const key = PLAYER_PREFIX + `${route.query.playlist || ''}${name}.jpg`
  const {
    data: { value: signedUrl },
  } = await useFetch('/api/player/signed-url', {
    params: { key },
  })

  if (!signedUrl)
    return fireError({ error: new Error('Could not get signed url!') })

  displayImageWhenFullyLoaded(signedUrl)
}
function displayImageWhenFullyLoaded(src: string) {
  if (process.server) {
    return
  }

  const img = new Image()

  img.onload = () => {
    coverUrl.value = img.src
  }

  img.src = src
}

// initialization
init()
</script>
