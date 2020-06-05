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
import Button from '~/components/Button.vue'
import Event from '~/components/Event.vue'

export default {
  components: {
    Button,
    Event,
  },
  async asyncData({ $axios, query }) {
    const limit = +(query.limit ? query.limit : 100)
    const start = +(query.start ? query.start : 0)

    const apiQuery = new URLSearchParams({
      _sort: 'date_start:DESC',
      _limit: String(limit),
      _start: String(start),
    })

    const urlEvents = `/events?${apiQuery.toString()}`
    const urlEventsCount = '/events/count'

    const eventsCountTotal = await $axios.$get(urlEventsCount)
    const events = await $axios.$get(urlEvents)

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
  },
  watchQuery: ['limit', 'start'],
  methods: {
    goPrevious() {
      this.$router.push({
        path: this.$route.path,
        query: this.queryPrevious,
      })
    },
    goNext() {
      this.$router.push({
        path: this.$route.path,
        query: this.queryNext,
      })
    },
  },
  head() {
    const queryPreviousSearchParamsString =
      '?' + new URLSearchParams(this.queryPrevious).toString()
    return {
      link: [
        {
          href: this.$route.path,
          rel: 'canonical',
        },
        ...(this.showPrevious
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
        ...(this.showNext
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
  },
}
</script>
