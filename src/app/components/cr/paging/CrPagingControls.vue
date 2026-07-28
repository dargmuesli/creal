<template>
  <div class="text-center">
    <div class="my-4">{{ partString }}</div>
    <div class="inline-grid grid-cols-2">
      <VioButton
        :aria-label="t('previous')"
        :disabled="!isPreviousAllowed"
        :icon="false"
        :wrapper-class="'mx-2'"
        @click="goPrevious"
      >
        {{ t('previous') }}
      </VioButton>
      <VioButton
        :aria-label="t('next')"
        :disabled="!isNextAllowed"
        :icon="false"
        :wrapper-class="'mx-2'"
        @click="goNext"
      >
        {{ t('next') }}
      </VioButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'

const { isPreviousAllowed = true, isNextAllowed = true } = defineProps<{
  isPreviousAllowed?: boolean
  isNextAllowed?: boolean
  partString: string
}>()

const { t } = useI18n()
const page = useRouteQuery('page', '1', {
  mode: 'push',
  transform: { get: Number, set: String },
})

// methods
const goPrevious = () => page.value--
const goNext = () => page.value++
</script>

<i18n lang="yaml">
de:
  next: Weiter
  previous: Zurück
en:
  next: Next
  previous: Previous
</i18n>
