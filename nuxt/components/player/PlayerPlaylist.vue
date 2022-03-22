<template>
  <section class="flex flex-col">
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

<script lang="ts">
import { defineComponent, PropType } from '#app'
import { PLAYER_PREFIX, Playlist } from '../../server/api/player/playlists'

export default defineComponent({
  props: {
    playlist: {
      required: true,
      type: Object as PropType<Playlist>,
    },
  },
  data() {
    return {
      coverUrl: '',
    }
  },
  created() {
    if (this.playlist.cover) {
      this.setCoverUrl(this.playlist.name)
    } else {
      this.coverUrl = '/player/playlist-cover_default.jpg'
    }
  },
  methods: {
    setCoverUrl(name: string) {
      const key =
        PLAYER_PREFIX +
        `${
          this.$route.query.playlist !== undefined
            ? this.$route.query.playlist
            : ''
        }${name}.jpg`
      this.displayImageWhenFullyLoaded(
        this.$axios.$get('/player/signed-url', {
          params: new URLSearchParams({ key }),
        })
      )
    },
    async displayImageWhenFullyLoaded(promise: Promise<any>) {
      if (process.server) {
        return
      }

      const img = new Image()

      img.onload = () => {
        this.coverUrl = img.src
      }

      img.src = await promise
    },
  },
})
</script>
