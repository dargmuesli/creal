<template>
  <div>
    <h2 class="m-0">{{ faq.title }}</h2>
    <div class="mb-4">
      <!-- Do not insert other characters (newlines) in vue-markdown's body! -->
      <vue-markdown>{{ faq.answer }}</vue-markdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import VueMarkdown from 'vue-markdown-konishi'

import Button from '~/components/Button.vue'

interface Faq {
  title: any
  answer: any
}

@Component({
  components: {
    Button,
    VueMarkdown,
  },
})
export default class extends Vue {
  @Prop({ type: Object }) readonly faq!: Faq
}
</script>
