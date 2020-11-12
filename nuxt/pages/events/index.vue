<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>{{ title }}</h1>
      <Error v-if="requestError !== null" :error="requestError">
        {{ requestError.message }}
      </Error>
      <div v-else-if="items !== null && items.length > 0">
        <ul class="list-none">
          <li
            v-for="item in items"
            :key="item.id"
            class="border my-4 p-4 rounded first:mt-0 last:mb-0"
          >
            <Event :event="item" />
          </li>
        </ul>
        <PagingControls
          v-if="allowPrevious || allowNext"
          :part-string="partString"
          :query-previous="queryPrevious"
          :query-next="queryNext"
          :allow-previous="allowPrevious"
          :allow-next="allowNext"
        />
      </div>
      <div v-else class="text-center">No events found.</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import Paging from '~/classes/Paging.ts'

@Component({
  head(this: EventsPage): Object {
    return {
      title: this.title,
    }
  },
})
export default class EventsPage extends Paging {
  title: String = 'Events'

  async asyncData({
    $axios,
    $paging,
    query,
  }: {
    $axios: any
    $paging: any
    query: any
  }) {
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
  }
}
</script>
