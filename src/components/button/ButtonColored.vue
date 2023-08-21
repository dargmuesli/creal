<template>
  <Button
    :is-to-relative="isToRelative"
    :aria-label="ariaLabel"
    class="rounded-md border px-4 py-2 font-medium"
    :class="
      [
        ...(isPrimary
          ? [
              'text-text-bright border-transparent bg-gray-800 hover:bg-black dark:bg-yellow-500  dark:text-gray-800 dark:hover:bg-yellow-600',
            ]
          : [
              'text-text-dark dark:text-text-bright border-gray-300 hover:bg-black/5 dark:border-gray-600 dark:hover:bg-black/30',
            ]),
      ].join(' ')
    "
    :disabled="disabled"
    :to="to"
    :type="type"
    @click="emit('click')"
  >
    <slot />
    <template #prefix>
      <slot name="prefix" />
    </template>
    <template #suffix>
      <slot name="suffix" />
    </template>
  </Button>
</template>

<script setup lang="ts">
export interface Props {
  ariaLabel: string
  disabled?: boolean
  isPrimary?: boolean
  isToRelative?: boolean
  to?: string
  type?: 'button' | 'reset' | 'submit'
}
withDefaults(defineProps<Props>(), {
  disabled: false,
  isPrimary: true,
  isToRelative: false,
  to: undefined,
  type: 'button',
})

const emit = defineEmits<{
  click: []
}>()
</script>
