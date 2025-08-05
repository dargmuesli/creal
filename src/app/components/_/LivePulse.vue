<template>
  <span :class="cn('relative flex size-3', classProps)">
    <span
      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"
    />
    <span class="relative inline-flex size-3 rounded-full bg-yellow-500" />
  </span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/utils/shadcn'

const { class: classProps = undefined } = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>
