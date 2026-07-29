<template>
  <nav
    aria-label="Pagination"
    class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6"
  >
    <VioButtonColored
      :aria-label="t('previous')"
      class="disabled:pointer-events-none disabled:opacity-40"
      :disabled="!isPreviousAllowed"
      :is-primary="false"
      @click="goPrevious"
    >
      <template #prefix>
        <ChevronLeftIcon aria-hidden="true" class="h-5 w-5" />
      </template>
      {{ t('previous') }}
    </VioButtonColored>
    <span class="text-sm text-gray-500 dark:text-gray-400">
      {{ partString }}
    </span>
    <VioButtonColored
      :aria-label="t('next')"
      class="disabled:pointer-events-none disabled:opacity-40"
      :disabled="!isNextAllowed"
      :is-primary="false"
      @click="goNext"
    >
      {{ t('next') }}
      <template #suffix>
        <ChevronRightIcon aria-hidden="true" class="h-5 w-5" />
      </template>
    </VioButtonColored>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
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
