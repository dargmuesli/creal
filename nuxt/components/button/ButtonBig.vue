<template>
  <Button :classes="buttonClass" :aria-label="ariaLabel" :to="to">
    <span
      class="flex flex-col items-center justify-center text-4xl leading-normal sm:text-5xl sm:leading-normal md:flex-row md:gap-4 lg:text-6xl lg:leading-normal"
    >
      <slot />
    </span>
  </Button>
</template>

<script setup lang="ts">
export interface Props {
  ariaLabel: string
  buttonClass?: string
  isToRelative?: boolean
  to?: string
  type?: 'button' | 'submit' | 'reset'
}
withDefaults(defineProps<Props>(), {
  buttonClass:
    'bg-yellow-500 hover:bg-yellow-600 h-full px-6 py-2 rounded text-gray-800 w-full',
  isToRelative: false,
  to: undefined,
  type: 'button',
})
</script>
