<template>
  <section>
    <img :src="coverUrl" />
    <h1 class="leading-tight m-0 mt-1 text-2xl text-left">
      {{ playlist.name }}
    </h1>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

interface Playlist {
  name: string
  items: any[]
}

@Component({})
export default class extends Vue {
  @Prop({ type: Object }) readonly playlist!: Playlist

  coverUrl: string = '/player/playlist-cover_default.jpg'

  created() {
    if ((this.playlist.items as any).cover) {
      this.getCoverUrl(this.playlist.name)
    }
  }

  async getCoverUrl(name: string) {
    const key = `${
      this.$route.query.playlist !== undefined ? this.$route.query.playlist : ''
    }${name}/playlist-cover.jpg`
    this.coverUrl = await this.$axios.$get('/player/signedUrl', {
      params: new URLSearchParams({ key }),
    })
  }
}
</script>
