<template>
  <div class="text-center">
    <AppLink
      v-if="to"
      ref="button"
      :append="append"
      :aria-label="ariaLabel"
      :class="['button', ...(buttonClass ? [buttonClass] : [])].join(' ')"
      :disabled="disabled"
      :is-colored="false"
      :to="to"
    >
      <slot />
    </AppLink>
    <button
      v-else
      ref="button"
      :aria-label="ariaLabel"
      :class="['button', ...(buttonClass ? [buttonClass] : [])].join(' ')"
      :disabled="disabled"
      :type="type"
      @click="$emit('click')"
    >
      <slot />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'

export default defineComponent({
  name: 'CrealButton',
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
        'bg-yellow-500 hover:bg-yellow-600 inline-block px-6 py-2 rounded text-gray-800',
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
  methods: {
    click() {
      ;(this.$refs.button as HTMLButtonElement).click()
    },
  },
})
</script>
