<template>
  <Button :button-class="buttonClass" :aria-label="ariaLabel" :to="to">
    <span
      class="text-4xl leading-normal sm:text-5xl sm:leading-normal lg:text-6xl lg:leading-normal"
    >
      <FontAwesomeIcon
        v-if="iconId"
        :class="{ 'mr-2': $slots.default }"
        :icon="iconId"
      />
      <br class="sm:hidden" />
      <slot />
    </span>
  </Button>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'

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
    iconId: {
      default: undefined,
      type: Array as PropType<string[] | undefined>,
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
  // @Prop({ type: String, default: 'mr-6' }) readonly iconClass!: String
  // @Prop({ type: String, default: '3x' }) readonly iconSize!: String
})
</script>
