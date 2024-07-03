<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <Paging
      v-else-if="items?.length"
      class="flex flex-col gap-4 lg:gap-8"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <ul>
        <li v-for="item in items" :id="item.id" :key="item.id">
          <Testimonial :testimonial="item.attributes" />
        </li>
      </ul>
    </Paging>
    <div v-else class="text-center">{{ t('none') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { CrealTestimonial } from '~/types/creal'

const { t } = useI18n()
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
  none: Keine Erfahrungsberichte verfügbar
  title: Erfahrungsberichte
en:
  none: No testimonials available
  title: Testimonials
</i18n>
