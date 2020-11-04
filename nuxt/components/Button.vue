<template>
  <div :class="wrapperClass">
    <!-- eslint-disable vue/attribute-hyphenation -->
    <app-link v-if="link !== undefined" tabIndex="-1" :to="link">
      <!-- eslint-enable vue/attribute-hyphenation -->
      <button
        class="btn flex h-full items-center justify-center w-full"
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
    </app-link>
    <button
      v-else
      class="btn flex h-full items-center justify-center w-full"
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
  </div>
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
