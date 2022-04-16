<template>
  <section v-if="faq">
    <button
      class="flex w-full items-center gap-4 p-4"
      :class="{ 'border-b': faq.isFocused }"
      @click="$emit('click', faq)"
    >
      <IconChatSolid class="shrink-0" />
      <h1 class="creal-prose-fullwidth m-0 text-left">
        {{ faq.title }}
      </h1>
    </button>
    <div
      ref="answer"
      class="overflow-hidden duration-300"
      :style="`max-height: ${getMaxHeight()}px`"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="creal-prose-fullwidth p-8" v-html="$marked(faq.answer)" />
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
