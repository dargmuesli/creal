<template>
  <div class="container mx-auto">
    <section>
      <h1>{{ title }}</h1>
      <Error v-if="requestError" :error="requestError">
        {{ requestError.message }}
      </Error>
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
            :key="item.id"
            class="border my-4 p-4 rounded first:mt-0 last:mb-0"
          >
            <Event :event="item" />
          </li>
        </ul>
      </Paging>
      <div v-else class="text-center">{{ $t('eventsNone') }}</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  async asyncData({ $axios, $paging, query }: Context) {
    const limit = +(query.limit ? query.limit : 100)
    const start = +(query.start ? query.start : 0)

    let eventsCountTotal, events

    const maxTryCount = 3
    let tryCount = 1
    let requestError

    while (tryCount <= maxTryCount && !(eventsCountTotal && events)) {
      try {
        eventsCountTotal = await $axios.$get('/strapi/events/count')
        events = await $axios.$get('/strapi/events', {
          params: new URLSearchParams({
            _sort: 'dateStart:DESC',
            _limit: String(limit),
            _start: String(start),
          }),
        })
      } catch (e) {
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

    return $paging(events, eventsCountTotal, query, start, limit)
  },
  data() {
    return {
      requestError: undefined,
      title: 'Events',
    }
  },
  head() {
    const title = this.title as string
    return {
      title,
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: 'Events at which DJ cReal performs.',
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Events at which DJ cReal performs.',
        },
      ],
    }
  },
  watchQuery: ['limit', 'start'],
})
</script>

<i18n lang="yml">
de:
  eventsNone: Keine Veranstaltungen gefunden.
en:
  eventsNone: No events found.
</i18n>
