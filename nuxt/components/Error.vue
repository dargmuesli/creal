<template>
  <div
    v-if="error !== null"
    class="border border-red-400 p-4 rounded text-red-400"
  >
    {{ error.message }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  @Prop({ type: Error, required: true }) readonly error!: Error
}
</script>
