<template>
  <Button :button-class="buttonClass" :aria-label="ariaLabel" :to="to">
    <span
      class="flex flex-col items-center justify-center text-4xl leading-normal sm:text-5xl sm:leading-normal md:flex-row md:gap-4 lg:text-6xl lg:leading-normal"
    >
      <slot />
    </span>
  </Button>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    append: {
      default: false,
      type: Boolean,
    },
    ariaLabel: {
      required: true,
      type: String,
    },
    buttonClass: {
      default:
        'bg-yellow-500 hover:bg-yellow-600 h-full px-6 py-2 rounded text-gray-800 w-full',
      type: String as PropType<string | undefined>,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    to: {
      default: undefined,
      type: String as PropType<string | undefined>,
    },
    type: {
      default: 'button',
      type: String,
    },
  },
})
</script>
