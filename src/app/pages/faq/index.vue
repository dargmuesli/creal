<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <Paging
      v-if="faqs?.length && paging"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <ul>
        <li
          v-for="faq in faqs"
          :id="`${faq.documentId}`"
          :key="faq.documentId"
          class="border duration-300 first:rounded-t-sm last:rounded-b-sm"
          :class="
            itemFocusedId
              ? itemFocusedId === faq.documentId
                ? 'my-4'
                : 'mx-8 -my-px last:my-0'
              : '-my-px'
          "
        >
          <FaqItem
            :faq-item="faq"
            :is-focused="itemFocusedId === faq.documentId"
            @click="toggleItemFocus(faq.documentId)"
          />
        </li>
      </ul>
    </Paging>
    <div v-else class="text-center">{{ t('faqNone') }}</div>
  </div>
</template>

<script setup lang="ts">
import { htmlToText } from 'html-to-text'
import { marked } from 'marked'

const { t } = useI18n()
const route = useRoute()
const {
  items: faqs,
  paging,
  requestError,
} = await useStrapiData<CrealFaq>({
  path: '/faqs',
  query: {
    sort: 'title:asc',
  },
})

// data
const itemFocusedId = ref<string>()
const title = t('titlePage')

// methods
const toggleItemFocus = (id: string) => {
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
  itemFocusedId.value = route.hash.substring(1)
})
// watchQuery: ['limit', 'start'],

// initialization
useHeadDefault({
  description: t('description'),
  title,
})
// TODO: remove markdown formatting
useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  (faqs || []).map(async (faq) =>
    defineQuestion({
      name: faq.title,
      acceptedAnswer: htmlToText(await marked(faq.answer)),
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
