<template>
  <div class="flex">
    <button class="mr-3" title="download" @click="download()">
      <font-awesome-icon :icon="['fas', 'download']" />
    </button>
    <div class="flex-grow">
      {{ playlistItem.name.replace(/^cReal - /, '').replace(/\.mp3$/, '') }}
    </div>
    <button class="ml-3" title="play" @click="play()">
      <font-awesome-icon :icon="['fas', 'play']" />
    </button>
  </div>
</template>

<script lang="ts">
import merge from 'lodash.mergewith'
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
      params: new URLSearchParams(
        merge(
          {},
          {
            ...(key !== undefined && {
              key,
            }),
          }
        )
      ),
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
  }
}
</script>
