<template>
  <Button
    class="flex-grow mt-2"
    :icon="icon"
    :icon-class="iconClass"
    :icon-id="iconId"
    :icon-size="iconSize"
    :link="link"
  >
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
  @Prop({ type: Boolean, default: true }) readonly icon!: Boolean
  @Prop({ type: String, default: 'mr-6' }) readonly iconClass!: String
  @Prop({ type: String, default: 'bug' }) readonly iconId!: String
  @Prop({ type: String, default: '3x' }) readonly iconSize!: String
}
</script>
