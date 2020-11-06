<template>
  <section class="flex flex-col">
    <img v-if="coverUrl !== ''" alt="Cover image." :src="coverUrl" />
    <div v-else class="flex flex-grow justify-center items-center">
      <div class="pulseLoader" />
    </div>
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

  coverUrl: string = ''

  created() {
    if ((this.playlist.items as any).cover) {
      this.setCoverUrl(this.playlist.name)
    } else {
      this.coverUrl = '/player/playlist-cover_default.jpg'
    }
  }

  setCoverUrl(name: string) {
    const key = `${
      this.$route.query.playlist !== undefined ? this.$route.query.playlist : ''
    }${name}/playlist-cover.jpg`
    this.displayImageWhenFullyLoaded(
      this.$axios.$get('/player/signedUrl', {
        params: new URLSearchParams({ key }),
      })
    )
  }

  async displayImageWhenFullyLoaded(promise: Promise<any>) {
    const img = new Image()

    img.onload = () => {
      this.coverUrl = img.src
    }

    img.src = await promise
  }
}
</script>
