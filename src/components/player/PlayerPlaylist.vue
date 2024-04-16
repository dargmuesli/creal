<template>
  <section class="flex w-full flex-col">
    <img
      v-if="coverUrl !== ''"
      alt="Cover image."
      class="rounded"
      :src="coverUrl"
    />
    <div v-else class="m-auto h-16 w-16">
      <VioLoaderIndicatorPing />
    </div>
    <strong class="m-0 mt-1 line-clamp-2 text-left text-2xl leading-tight">
      {{ playlist.name }}
    </strong>
  </section>
</template>

<script setup lang="ts">
import type { Playlist } from '~/types/player'

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
  if (props.playlist.isCoverAvailable) {
    setCoverUrl(props.playlist.name)
  } else {
    coverUrl.value = '/player/playlist-cover_default.jpg'
  }
}
const setCoverUrl = async (name: string) => {
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
const displayImageWhenFullyLoaded = (src: string) => {
  if (import.meta.server) return

  const img = new Image()

  img.onload = () => {
    coverUrl.value = img.src
  }

  img.src = src
}

// initialization
init()
</script>
