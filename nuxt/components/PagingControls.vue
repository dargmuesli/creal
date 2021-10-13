<template>
  <div class="text-center">
    <div class="my-4">{{ partString }}</div>
    <div class="inline-grid grid-cols-2">
      <Button
        :aria-label="$t('previous')"
        :icon="false"
        :disabled="!isPreviousAllowed"
        :wrapper-class="'mx-2'"
        @click.native="goPrevious"
      >
        {{ $t('previous') }}
      </Button>
      <Button
        :aria-label="$t('next')"
        :icon="false"
        :disabled="!isNextAllowed"
        :wrapper-class="'mx-2'"
        @click.native="goNext"
      >
        {{ $t('next') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    isPreviousAllowed: {
      required: true,
      type: Boolean,
    },
    isNextAllowed: {
      required: true,
      type: Boolean,
    },
    partString: {
      required: true,
      type: String,
    },
    queryPrevious: {
      required: true,
      type: Object as PropType<Record<any, any>>,
    },
    queryNext: {
      required: true,
      type: Object as PropType<Record<any, any>>,
    },
  },
  methods: {
    goPrevious() {
      this.$router.push({
        path: this.$route.path,
        query: this.queryPrevious,
      })
    },
    goNext() {
      this.$router.push({
        path: this.$route.path,
        query: this.queryNext,
      })
    },
  },
})
</script>

<i18n lang="yml">
de:
  next: Weiter
  previous: Zurück
en:
  next: Next
  previous: Previous
</i18n>
