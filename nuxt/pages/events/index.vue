<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>Events</h1>
      <ul class="list-none">
        <li
          v-for="event in events"
          :key="event.id"
          class="border my-4 p-4 rounded first:mt-0 last:mb-0"
        >
          <Event :event="event" />
        </li>
      </ul>
      <div class="text-center">
        <div class="my-4">{{ partString }}</div>
        <div class="inline-grid grid-cols-2">
          <Button
            :disabled="!allowPrevious"
            :wrapper-class="'mx-2'"
            @click.native="goPrevious"
          >
            Previous
          </Button>
          <Button
            :disabled="!allowNext"
            :wrapper-class="'mx-2'"
            @click.native="goNext"
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import Button from '~/components/Button.vue'
import Event from '~/components/Event.vue'

interface AsyncData {
  events: Array<object> | undefined
  partString: string | undefined
  queryNext: object | undefined
  queryPrevious: object | undefined
  allowNext: boolean | undefined
  allowPrevious: boolean | undefined
}

@Component({
  components: {
    Button,
    Event,
  },
})
export default class extends Vue {
  events?: Array<object>
  queryPrevious?: Record<string, string>
  queryNext?: Record<string, string>
  allowNext?: boolean
  allowPrevious?: boolean

  async asyncData({
    $axios,
    query,
  }: {
    $axios: any
    query: any
  }): Promise<AsyncData> {
    const limit = +(query.limit ? query.limit : 100)
    const start = +(query.start ? query.start : 0)

    const apiQuery = new URLSearchParams({
      _sort: 'date_start:DESC',
      _limit: String(limit),
      _start: String(start),
    })

    const urlEvents = `/events?${apiQuery.toString()}`
    const urlEventsCount = '/events/count'

    let eventsCountTotal, events

    try {
      eventsCountTotal = await $axios.$get(urlEventsCount)
      events = await $axios.$get(urlEvents)
    } catch (e) {
      return {
        events: undefined,
        partString: undefined,
        queryNext: undefined,
        queryPrevious: undefined,
        allowNext: undefined,
        allowPrevious: undefined,
      }
    }

    const partString =
      (events.length > 0 ? start + 1 : 0) +
      '-' +
      (start + events.length) +
      ' / ' +
      eventsCountTotal

    const startPrevious = Math.max(0, start - limit)
    const queryPrevious = {
      ...(query.limit && { limit: query.limit }),
      ...(startPrevious > 0 && { start: startPrevious }),
    }
    const queryNext = {
      ...(query.limit && { limit: query.limit }),
      start: start + limit,
    }

    const allowNext = start + events.length < eventsCountTotal
    const allowPrevious = start > 0

    return {
      events,
      partString,
      queryNext,
      queryPrevious,
      allowNext,
      allowPrevious,
    }
  }

  watchQuery() {
    return ['limit', 'start']
  }

  goPrevious() {
    this.$router.push({
      path: this.$route.path,
      query: this.queryPrevious,
    })
  }

  goNext() {
    this.$router.push({
      path: this.$route.path,
      query: this.queryNext,
    })
  }

  head() {
    const queryPreviousSearchParamsString =
      '?' + new URLSearchParams(this.queryPrevious).toString()
    return {
      link: [
        {
          href: this.$route.path,
          rel: 'canonical',
        },
        ...(this.allowPrevious
          ? [
              {
                href:
                  queryPreviousSearchParamsString === '?'
                    ? this.$route.path
                    : this.$route.path + queryPreviousSearchParamsString,
                rel: 'prev',
              },
            ]
          : []),
        ...(this.allowNext
          ? [
              {
                href:
                  this.$route.path +
                  '?' +
                  new URLSearchParams(this.queryNext).toString(),
                rel: 'next',
              },
            ]
          : []),
      ],
    }
  }
}
</script>
