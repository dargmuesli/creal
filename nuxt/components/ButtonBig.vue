<template>
  <Button class="flex-grow mt-2" :link="link">
    <span class="text-4xl sm:text-5xl lg:text-6xl">
      <slot />
    </span>
  </Button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import Button from '~/components/Button.vue'

@Component({
  components: {
    Button,
  },
})
export default class extends Vue {
  @Prop({ type: String, required: true }) readonly link!: String
}
</script>
