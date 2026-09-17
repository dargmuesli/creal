<template>
  <div class="mb-32 flex justify-center">
    <div
      class="bg-background-darken flex flex-col items-center gap-8 rounded-lg p-8 lg:flex-row lg:gap-16 lg:px-16"
    >
      <div class="flex flex-col gap-4">
        <span class="text-4xl font-bold">{{ title }}</span>
        <span class="text-xl">{{ text }}</span>
      </div>
      <VioButtonColored
        :aria-label="t('bookCreal')"
        class="font-semibold shadow-xs"
        :to="localePath('/contact')"
      >
        {{ t('bookCreal') }} {{ t('arrow') }}
      </VioButtonColored>
    </div>
  </div>
</template>

<script setup lang="ts">
const { text, title } = defineProps<{
  text: string
  title: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<i18n lang="yaml">
de:
  arrow: →
  bookCreal: cReal buchen
en:
  arrow: →
  bookCreal: Book cReal
</i18n>
