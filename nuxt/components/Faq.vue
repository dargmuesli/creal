<template>
  <section>
    <button
      class="flex p-4 w-full"
      :class="{ 'border-b': faq.focused }"
      @click="toggleFunction(faq)"
    >
      <font-awesome-icon :icon="['fas', 'comments']" class="mr-4" size="lg" />
      <h1 class="font-normal mb-0 text-base text-left">
        {{ faq.title }}
      </h1>
    </button>
    <div
      ref="answer"
      class="duration-300 overflow-hidden text-left"
      :style="`max-height: ${getMaxHeight()}px`"
    >
      <!-- Do not insert other characters (newlines) in vue-markdown's body! -->
      <vue-markdown class="m-8">{{ faq.answer }}</vue-markdown>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import VueMarkdown from 'vue-markdown-konishi'

interface Faq {
  title: any
  answer: any
  focused: boolean
}

@Component({
  components: {
    VueMarkdown,
  },
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly faq!: Faq
  @Prop({ type: Function }) readonly toggleFunction!: Function

  getMaxHeight() {
    if (
      this.faq.focused &&
      this.$refs.answer !== undefined &&
      this.$refs.answer instanceof Element
    ) {
      return this.$refs.answer.scrollHeight
    } else {
      return 0
    }
  }
}
</script>
