<template>
  <div class="text-center">
    <div class="my-4">{{ partString }}</div>
    <div class="inline-grid grid-cols-2">
      <Button
        :icon="false"
        :disabled="!allowPrevious"
        :wrapper-class="'mx-2'"
        @click.native="goPrevious"
      >
        Previous
      </Button>
      <Button
        :icon="false"
        :disabled="!allowNext"
        :wrapper-class="'mx-2'"
        @click.native="goNext"
      >
        Next
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  @Prop({ type: String, required: true }) readonly partString!: String
  @Prop({ type: Object, required: true }) readonly queryPrevious!: Record<
    any,
    any
  >

  @Prop({ type: Object, required: true }) readonly queryNext!: Record<any, any>
  @Prop({ type: Boolean, required: true }) readonly allowPrevious!: Boolean
  @Prop({ type: Boolean, required: true }) readonly allowNext!: Boolean

  goPrevious() {
    this.$router.push({
      path: this.$route.path,
      query: this.queryPrevious,
    })
  }

  goNext() {
    this.$router.push({
      path: this.$route.path,
      query: this.queryNext,
    })
  }
}
</script>
