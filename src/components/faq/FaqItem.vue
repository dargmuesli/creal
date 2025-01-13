<template>
  <section v-if="faqItem">
    <button
      class="flex w-full items-center gap-4 p-4"
      :class="{ 'border-b': isFocused }"
      type="button"
    >
      <VioIconChatSolid class="shrink-0" />
      <VioLayoutProse is-full-width>
        <strong class="m-0 text-left">
          {{ faqItem.title }}
        </strong>
      </VioLayoutProse>
    </button>
    <div
      ref="answerRef"
      class="overflow-hidden duration-300"
      :style="`max-height: ${getMaxHeight()}px`"
    >
      <!-- eslint-disable vue/no-v-html -->
      <VioLayoutProse class="p-8" is-full-width>
        <div v-html="marked(faqItem.answer)" />
      </VioLayoutProse>
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/types/fetch'
import { marked } from 'marked'

import type { CrealFaq } from '~/types/creal'

interface Props {
  faqItem: CollectionItem<CrealFaq>
  isFocused: boolean
}
const props = withDefaults(defineProps<Props>(), {})

// data
const answerRef = ref()

// methods
const getMaxHeight = () => {
  if (props.isFocused && answerRef.value instanceof Element) {
    return answerRef.value.scrollHeight
  } else {
    return 0
  }
}
</script>
