<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <div v-else-if="items?.length && paging" class="flex flex-col gap-32">
      <CrPaging
        class="flex flex-col gap-4 lg:gap-8"
        :is-next-allowed="paging.isNextAllowed"
        :is-previous-allowed="paging.isPreviousAllowed"
        :page="paging.page"
        :part-string="paging.partString"
      >
        <ul>
          <li
            v-for="item in items"
            :id="`${item.documentId}`"
            :key="item.documentId"
          >
            <CrTestimonial :testimonial="item" />
          </li>
        </ul>
      </CrPaging>
      <CrBookingCta :text="t('ctaText')" :title="t('ctaTitle')" />
    </div>
    <div v-else class="text-center">{{ t('none') }}</div>
  </div>
</template>

<script setup lang="ts">
// remount on pagination changes so the top-level `await` below refetches
definePageMeta({
  key: (route) => route.fullPath,
})

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

// initialization
useCrealHeadDefault({ title })
</script>

<i18n lang="yaml">
de:
  ctaText: Buche mich und füge dein Feedback hinzu! 😉
  ctaTitle: Das ist alles?
  none: Keine Erfahrungsberichte verfügbar
  title: Erfahrungsberichte
en:
  ctaText: Book me and get quoted! 😉
  ctaTitle: That's all?
  none: No testimonials available
  title: Testimonials
</i18n>
