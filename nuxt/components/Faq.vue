<template>
  <section>
    <button
      class="flex p-4 w-full"
      :class="{ 'border-b': faq.isFocused }"
      @click="$emit('click', faq)"
    >
      <font-awesome-icon :icon="['fas', 'comments']" class="mr-4" size="lg" />
      <h1 class="font-normal m-0 text-base text-left">
        {{ faq.title }}
      </h1>
    </button>
    <div
      ref="answer"
      class="duration-300 overflow-hidden text-left"
      :style="`max-height: ${getMaxHeight()}px`"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="m-8" v-html="$marked(faq.answer)" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export interface Faq {
  answer: any
  isFocused: boolean
  title: any
}

export default defineComponent({
  props: {
    faq: {
      required: true,
      type: Object as PropType<Faq>,
    },
  },
  methods: {
    getMaxHeight() {
      if (
        this.faq.isFocused &&
        this.$refs.answer &&
        this.$refs.answer instanceof Element
      ) {
        return this.$refs.answer.scrollHeight
      } else {
        return 0
      }
    },
  },
})
</script>
