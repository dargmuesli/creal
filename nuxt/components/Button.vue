<template>
  <div :class="wrapperClass">
    <!-- eslint-disable vue/attribute-hyphenation -->
    <app-link v-if="link !== undefined" tabIndex="-1" :to="link">
      <!-- eslint-enable vue/attribute-hyphenation -->
      <button
        class="btn h-full w-full"
        :class="buttonClass"
        :disabled="disabled"
      >
        <!-- <font-awesome v-if="icon" class="mr-2" :icon="iconId" /> -->
        <slot />
      </button>
    </app-link>
    <button
      v-else
      class="btn h-full w-full"
      :class="buttonClass"
      :disabled="disabled"
    >
      <!-- <font-awesome v-if="icon" class="mr-2" :icon="iconId" /> -->
      <slot />
    </button>
  </div>
</template>

<script>
import AppLink from '~/components/AppLink.vue'

export default {
  components: { AppLink },
  props: {
    buttonClass: {
      type: String,
      default: 'bg-yellow-500 inline-block px-6 py-2 text-gray-800',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // icon: {
    //   type: Boolean,
    //   default: true,
    // },
    // iconId: {
    //   type: Array,
    //   default() {
    //     return ['fas', 'bug']
    //   },
    // },
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
