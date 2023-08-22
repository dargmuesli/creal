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
export interface Props {
  ariaLabel: string
  to?: string
}
withDefaults(defineProps<Props>(), {
  to: undefined,
})
</script>
