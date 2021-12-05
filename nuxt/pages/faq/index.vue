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
        <ul class="list-none">
          <li
            v-for="item in items"
            :key="slugify(item.title)"
            class="border duration-300 first:rounded-t last:rounded-b"
            :class="{
              'my-4': itemFocused === item,
              'mx-8 -my-px': itemFocused !== item,
            }"
          >
            <Faq :faq="item" @click="(e) => toggleItemFocused(e)" />
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

import { Faq } from '~/components/Faq.vue'
import { Paging } from '~/plugins/paging'

import { defineComponent } from '#app'

export default defineComponent({
  name: 'IndexPage',
  async asyncData({ $axios, $paging, query }: Context): Promise<
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
        itemsCountTotal = await $axios.$get('/strapi/faqs/count')
        items = await $axios.$get('/strapi/faqs', {
          params: new URLSearchParams({
            _sort: 'title:DESC',
            _limit: String(limit),
            _start: String(start),
          }),
        })
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
      items: undefined as Array<Faq> | undefined,
      itemFocused: undefined as Faq | undefined,
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
      if (slugify(item.title) === window.location.hash.substring(1)) {
        this.$set(item, 'isFocused', true)
        this.itemFocused = item
        break
      }
    }
  },
  methods: {
    slugify(input: string) {
      return slugify(input)
    },
    toggleItemFocused(item: any) {
      if (!this.itemFocused) {
        this.focusItem(item)
      } else {
        this.$set(this.itemFocused, 'isFocused', false)

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
    focusItem(item: any) {
      this.$set(item, 'isFocused', true)
      this.itemFocused = item
      history.replaceState(undefined, '', `#${slugify(item.title)}`)
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
