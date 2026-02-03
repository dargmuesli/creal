<template>
  <VioButtonColored :aria-label="ariaLabel" :to="to">
    <span
      class="flex flex-col items-center justify-center text-4xl sm:text-5xl md:flex-row md:gap-4 lg:text-6xl"
    >
      <slot />
    </span>
  </VioButtonColored>
</template>

<script setup lang="ts">
const { ariaLabel, to = undefined } = defineProps<{
  ariaLabel: string
  to?: string
}>()
</script>
