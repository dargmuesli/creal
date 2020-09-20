<template>
  <div class="flex select-none">
    <button
      class="ml-2 mr-3 lg:mr-10"
      :title="playlistItem.size"
      @click="download()"
    >
      <font-awesome-icon :icon="['fas', 'download']" />
    </button>
    <button
      class="cursor-default flex-grow py-2 lg:py-3 text-left"
      @click="itemClick"
    >
      {{ playlistItem.name.replace(/^cReal - /, '').replace(/\.mp3$/, '') }}
    </button>
    <button class="ml-3 lg:ml-10 mr-2" title="play" @click="play()">
      <font-awesome-icon :icon="['fas', 'play']" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

interface PlaylistItem {
  name: string
  size: number
}

@Component({})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly playlistItem!: PlaylistItem

  @Prop({ type: Function, required: true })
  readonly setSourceFunction!: Function

  async getSignedUrl() {
    const key = this.$route.query.playlist + '/' + this.playlistItem.name
    return await this.$axios.$get('/player/signedUrl', {
      params: new URLSearchParams({ key }),
    })
  }

  async download() {
    const link = document.createElement('a')
    link.setAttribute('href', await this.getSignedUrl())
    link.setAttribute('download', '123.mp3')
    link.click()
  }

  async play() {
    this.setSourceFunction(await this.getSignedUrl())
    document.title = this.playlistItem.name
      .replace(/^cReal - /, '')
      .replace(/\.mp3$/, '')
  }

  itemClick(event: any) {
    if (event.detail === 2) {
      // double click
      this.play()
    }
  }
}
</script>
