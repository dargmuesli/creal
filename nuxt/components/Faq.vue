<template>
  <section v-if="faq">
    <button
      class="flex w-full p-4"
      :class="{ 'border-b': faq.isFocused }"
      @click="$emit('click', faq)"
    >
      <font-awesome-icon :icon="['fas', 'comments']" class="mr-4" size="lg" />
      <h1 class="m-0 text-left text-base font-normal">
        {{ faq.title }}
      </h1>
    </button>
    <div
      ref="answer"
      class="overflow-hidden text-left duration-300"
      :style="`max-height: ${getMaxHeight()}px`"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="m-8" v-html="$marked(faq.answer)" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'

export interface Faq {
  answer: any
  isFocused: boolean
  title: any
}

export default defineComponent({
  name: 'CrealFaq',
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
