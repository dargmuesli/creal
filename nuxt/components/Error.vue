<template>
  <div v-if="error" class="border border-red-400 p-4 rounded text-red-400">
    {{ error.message }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    error: {
      required: true,
      type: Object,
    },
  },
})
</script>
