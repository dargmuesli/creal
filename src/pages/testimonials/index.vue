<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <div v-else-if="items?.length && paging" class="flex flex-col gap-32">
      <Paging
        class="flex flex-col gap-4 lg:gap-8"
        :is-previous-allowed="paging.isPreviousAllowed"
        :is-next-allowed="paging.isNextAllowed"
        :part-string="paging.partString"
        :query-previous="paging.queryPrevious"
        :query-next="paging.queryNext"
      >
        <ul>
          <li v-for="item in items" :id="`${item.id}`" :key="item.id">
            <Testimonial :testimonial="item.attributes" />
          </li>
        </ul>
      </Paging>
      <div class="mb-32 flex justify-center">
        <div
          class="bg-background-darken flex flex-col items-center gap-8 rounded-lg p-8 lg:flex-row lg:gap-16 lg:px-16"
        >
          <div class="flex flex-col gap-4">
            <span class="text-4xl font-bold">{{ t('ctaTitle') }}</span>
            <span class="text-xl">{{ t('ctaText') }}</span>
          </div>
          <VioButtonColored
            aria-label="Book cReal"
            class="font-semibold shadow-sm"
            :to="localePath('/contact')"
          >
            {{ t('ctaButton') }}
          </VioButtonColored>
        </div>
      </div>
    </div>
    <div v-else class="text-center">{{ t('none') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { CrealTestimonial } from '~/types/creal'

const { t } = useI18n()
const localePath = useLocalePath()
const { items, paging, requestError } = await useStrapiData<CrealTestimonial>({
  path: '/testimonials',
  query: {
    populate: 'picture',
    sort: 'createdAt:desc',
  },
})

// data
const title = t('title')
</script>

<i18n lang="yaml">
de:
  ctaButton: cReal buchen →
  ctaText: Buche mich und füge dein Feedback hinzu! 😉
  ctaTitle: Das ist alles?
  none: Keine Erfahrungsberichte verfügbar
  title: Erfahrungsberichte
en:
  ctaButton: Book cReal →
  ctaText: Book me and get quoted! 😉
  ctaTitle: That's all?
  none: No testimonials available
  title: Testimonials
</i18n>
