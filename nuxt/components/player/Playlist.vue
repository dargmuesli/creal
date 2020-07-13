<template>
  <section>
    <img
      :src="
        playlist.coverUrl !== undefined
          ? playlist.coverUrl
          : '/player/playlist-cover_default.jpg'
      "
    />
    <h1 class="leading-tight m-0 mt-1 text-2xl">{{ playlist.name }}</h1>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

interface Playlist {
  name: string
  coverUrl: URL
  items: any[]
}

@Component({})
export default class extends Vue {
  @Prop({ type: Object }) readonly playlist!: Playlist
}
</script>
