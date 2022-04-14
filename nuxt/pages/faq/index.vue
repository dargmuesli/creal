<template>
  <div class="container mx-auto">
    <section>
      <h1>{{ title }}</h1>
      <CardAlert v-if="requestError" :error-message="requestError.message" />
      <Paging
        v-else-if="items && items.length > 0"
        :is-previous-allowed="isPreviousAllowed"
        :is-next-allowed="isNextAllowed"
        :part-string="partString"
        :query-previous="queryPrevious"
        :query-next="queryNext"
      >
        <ul>
          <li
            v-for="item in items"
            :key="slugify(item.attributes.title)"
            class="border duration-300 first:rounded-t last:rounded-b"
            :class="{
              'my-4': itemFocused === item,
              'mx-8 -my-px': itemFocused !== item,
            }"
          >
            <Faq :faq="item.attributes" @click="toggleItemFocused(item)" />
          </li>
        </ul>
      </Paging>
      <div v-else class="text-center">{{ $t('faqNone') }}</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import slugify from 'slugify'

import { defineComponent } from '#app'
import { Faq } from '~/components/Faq.vue'
import { CollectionItem, Paging } from '~/plugins/paging'

export default defineComponent({
  name: 'IndexPage',
  async asyncData({ $http, $paging, query }: Context): Promise<
    | ({
        itemFocused: Faq | undefined
      } & Paging)
    | { requestError: any }
  > {
    const limit = +(query.limit ? query.limit : 100)
    const start = +(query.start ? query.start : 0)

    let itemsCountTotal, items

    const maxTryCount = 3
    let tryCount = 1
    let requestError

    while (tryCount <= maxTryCount && !(itemsCountTotal && items)) {
      try {
        itemsCountTotal = ((await $http.$get('/faqs')) as any).meta.pagination
          .total
        items = (
          (await $http.$get('/faqs', {
            searchParams: new URLSearchParams({
              'pagination[limit]': String(limit),
              'pagination[start]': String(start),
              sort: 'title:desc',
            }),
          })) as any
        ).data
      } catch (e: any) {
        if (tryCount === maxTryCount) {
          requestError = e
        }
      }

      tryCount++
    }

    if (requestError) {
      return {
        requestError,
      }
    }

    return $paging(items, itemsCountTotal, query, start, limit)
  },
  data() {
    return {
      items: undefined as Array<CollectionItem<Faq>> | undefined,
      itemFocused: undefined as CollectionItem<Faq> | undefined,
      title: 'FAQ',
      requestError: undefined,
    }
  },
  head() {
    const title = this.title as string
    const description = this.$t('description') as string

    return {
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content:
            'https://creal.' +
            (process.env.NUXT_ENV_STACK_DOMAIN || 'jonas-thelemann.test') +
            this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
      ],
      title,
    }
  },
  watchQuery: ['limit', 'start'],
  mounted() {
    if (!this.items) return

    for (const item of this.items) {
      if (slugify(String(item.id)) === window.location.hash.substring(1)) {
        this.$set(item.attributes, 'isFocused', true)
        this.itemFocused = item
        break
      }
    }
  },
  methods: {
    slugify(input: string) {
      return slugify(input)
    },
    toggleItemFocused(item: CollectionItem<Faq>) {
      if (!this.itemFocused) {
        this.focusItem(item)
      } else {
        this.$set(this.itemFocused.attributes, 'isFocused', false)

        if (this.itemFocused === item) {
          this.itemFocused = undefined
          history.replaceState(
            '',
            document.title,
            window.location.pathname + window.location.search
          )
        } else {
          this.focusItem(item)
        }
      }
    },
    focusItem(item: CollectionItem<Faq>) {
      this.$set(item.attributes, 'isFocused', true)
      this.itemFocused = item
      history.replaceState(undefined, '', `#${slugify(String(item.id))}`)
    },
  },
})
</script>

<i18n lang="yml">
de:
  description: Häufig gestellte Fragen an DJ cReal.
  faqNone: Keine FAQ gefunden.
en:
  description: Frequently asked questions to DJ cReal.
  faqNone: No FAQ found.
</i18n>
