<template>
  <app-link
    v-if="link !== undefined"
    class="btn flex h-full items-center justify-center rounded"
    :class="buttonClass"
    :disabled="disabled"
    :to="link"
  >
    <font-awesome-icon
      v-if="icon"
      :class="iconClass"
      :icon="['fas', iconId]"
      :size="iconSize"
    />
    <slot />
  </app-link>
  <button
    v-else
    class="btn flex h-full items-center justify-center rounded"
    :class="buttonClass"
    :disabled="disabled"
  >
    <font-awesome-icon
      v-if="icon"
      :class="iconClass"
      :icon="['fas', iconId]"
      :size="iconSize"
    />
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    buttonClass: {
      type: String,
      default: 'bg-yellow-500 inline-block px-6 py-2 text-gray-800',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: true,
    },
    iconClass: {
      type: String,
      default() {
        return 'mr-2'
      },
    },
    iconId: {
      type: String,
      default() {
        return 'bug'
      },
    },
    iconSize: {
      type: String,
      default() {
        return 'lg'
      },
    },
    link: {
      type: String,
      default: undefined,
    },
    wrapperClass: {
      type: String,
      default: 'inline-block',
    },
  },
}
</script>
