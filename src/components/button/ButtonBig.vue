<template>
  <ButtonColored :aria-label="ariaLabel" :to="to">
    <span
      class="flex flex-col md:flex-row items-center justify-center md:gap-4 text-4xl sm:text-5xl lg:text-6xl"
    >
      <slot />
    </span>
  </ButtonColored>
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
