<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <Paging
      v-if="faqItems?.length"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <ul>
        <li
          v-for="faqItem in faqItems"
          :id="faqItem.id"
          :key="faqItem.id"
          class="border duration-300 first:rounded-t last:rounded-b"
          :class="
            itemFocusedId === faqItem.id ? 'my-4' : '-my-px mx-8 last:my-0'
          "
        >
          <FaqItem
            :faq-item="faqItem"
            :is-focused="itemFocusedId === faqItem.id"
            @click="toggleItemFocus(faqItem.id)"
          />
        </li>
      </ul>
    </Paging>
    <div v-else class="text-center">{{ t('faqNone') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { StrapiResult } from '@dargmuesli/nuxt-vio/types/fetch'
import { FETCH_RETRY_AMOUNT } from '@dargmuesli/nuxt-vio/utils/constants'
import { consola } from 'consola'
import { htmlToText } from 'html-to-text'
import { marked } from 'marked'

import type { CrealFaq } from '~/types/creal'

definePageMeta({ colorMode: 'dark' })

const { t, locale } = useI18n()
const route = useRoute()
const strapiFetch = useStrapiFetch()

// data
const itemFocusedId = ref<number>()
const title = t('titlePage')
const requestError = ref()
const querylimit = +(route.query.limit ? route.query.limit : 100)
const queryStart = +(route.query.start ? route.query.start : 0)

// async data
let asyncData: StrapiResult<CrealFaq> | undefined
try {
  asyncData = await strapiFetch('/faqs', {
    query: {
      locale: locale.value,
      'pagination[limit]': querylimit,
      'pagination[start]': queryStart,
      sort: 'title:asc',
    },
    retry: FETCH_RETRY_AMOUNT,
  })
} catch (error: any) {
  requestError.value = error
  consola.error(error)
}
const faqItems = asyncData?.data
const paging = getPaging({
  items: faqItems,
  itemsCountTotal: asyncData?.meta.pagination.total,
  query: route.query,
  start: queryStart,
  limit: querylimit,
})

// methods
const toggleItemFocus = (id: number) => {
  if (itemFocusedId.value === id) {
    itemFocusedId.value = undefined
    history.replaceState(undefined, '', '')
  } else {
    itemFocusedId.value = id
    history.replaceState(undefined, '', `#${id}`)
  }
}

// lifecycle
onMounted(() => {
  itemFocusedId.value = parseInt(route.hash.substring(1))
})
// watchQuery: ['limit', 'start'],

// initialization
useHeadDefault({
  title,
  extension: {
    description: t('description'),
  },
})
// TODO: remove markdown formatting
useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  (faqItems || []).map((faqItem) =>
    defineQuestion({
      name: faqItem.attributes.title,
      acceptedAnswer: htmlToText(marked(faqItem.attributes.answer)),
    }),
  ),
])
</script>

<i18n lang="yaml">
de:
  description: Häufig gestellte Fragen an DJ cReal.
  faqNone: Keine FAQ gefunden.
  titlePage: FAQ
en:
  description: Frequently asked questions to DJ cReal.
  faqNone: No FAQ found.
  titlePage: FAQ
</i18n>
