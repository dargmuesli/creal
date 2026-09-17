<template>
  <span :class="cn('relative flex size-3', classProps)">
    <span
      class="bg-vio-primary-bg absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
    />
    <span class="bg-vio-primary-bg relative inline-flex size-3 rounded-full" />
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const { class: classProps = undefined } = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>
