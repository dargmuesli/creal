<template>
  <section>
    <button
      class="flex p-4 text-left w-full"
      :class="{ 'border-b': faq.focused }"
      @click="toggleFunction(faq)"
    >
      <font-awesome-icon :icon="['fas', 'comments']" class="mr-4" size="lg" />
      <h1 class="font-normal mb-0 text-base">
        {{ faq.title }}
      </h1>
    </button>
    <div
      ref="answer"
      class="duration-300 overflow-hidden"
      :style="`max-height: ${answerMaxHeight}px`"
    >
      <!-- Do not insert other characters (newlines) in vue-markdown's body! -->
      <vue-markdown class="m-8">{{ faq.answer }}</vue-markdown>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import VueMarkdown from 'vue-markdown-konishi'

import Button from '~/components/Button.vue'

interface Faq {
  title: any
  answer: any
  focused: boolean
}

@Component({
  components: {
    Button,
    VueMarkdown,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly faq!: Faq
  @Prop({ type: Function }) readonly toggleFunction!: Function

  answerMaxHeight = 0

  @Watch('faq')
  onChildChanged(_newVal: any, _oldVal: any) {
    this.setMaxHeight()
  }

  mounted() {
    this.setMaxHeight()
  }

  setMaxHeight() {
    if (
      this.faq.focused &&
      this.$refs.answer !== undefined &&
      this.$refs.answer instanceof Element
    ) {
      this.answerMaxHeight = this.$refs.answer.scrollHeight
    } else {
      this.answerMaxHeight = 0
    }
  }
}
</script>
