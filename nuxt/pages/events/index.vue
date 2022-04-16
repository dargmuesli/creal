<template>
  <div class="container mx-auto">
    <section>
      <Breadcrumbs>
        {{ title }}
      </Breadcrumbs>
      <CardAlert v-if="requestError" :error-message="requestError.message" />
      <Paging
        v-else-if="items && items.length > 0"
        class="flex flex-col gap-4 lg:gap-8"
        :is-previous-allowed="isPreviousAllowed"
        :is-next-allowed="isNextAllowed"
        :part-string="partString"
        :query-previous="queryPrevious"
        :query-next="queryNext"
      >
        <EventList :events="itemsCurrent">
          <div class="flex items-center gap-2">
            {{ $t('eventsCurrent') }}
            <LivePulse />
          </div>
        </EventList>
        <EventList :events="itemsFuture">
          <div class="flex items-center gap-2">
            {{ $t('eventsFuture') }}
            <LivePulse v-if="!itemsCurrent || itemsCurrent.length === 0" />
          </div>
        </EventList>
        <EventList :events="itemsPast">
          {{ $t('eventsPast') }}
        </EventList>
      </Paging>
      <div v-else class="text-center">{{ $t('eventsNone') }}</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'

import { defineComponent } from '#app'
import { Event as CrealEvent } from '~/components/event/Event.vue'
import { CollectionItem } from '~/plugins/paging'

export default defineComponent({
  name: 'IndexPage',
  async asyncData({ $http, $paging, query }: Context) {
    const limit = +(query.limit ? query.limit : 100)
    const start = +(query.start ? query.start : 0)

    let eventsCountTotal, events

    const maxTryCount = 3
    let tryCount = 1
    let requestError

    while (tryCount <= maxTryCount && !(eventsCountTotal && events)) {
      try {
        eventsCountTotal = ((await $http.$get('/events')) as any).meta
          .pagination.total
        events = (
          (await $http.$get('/events', {
            searchParams: new URLSearchParams({
              'pagination[limit]': String(limit),
              'pagination[start]': String(start),
              populate: 'image',
              sort: 'dateStart:desc',
            }),
          })) as any
        ).data
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
      items: undefined as Array<CollectionItem<CrealEvent>> | undefined,
      requestError: undefined,
      title: this.$t('titlePage'),
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
          content: this.$baseUrl + this.$router.currentRoute.fullPath,
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
  computed: {
    itemsCurrent() {
      const events = this.items as Array<CollectionItem<CrealEvent>> | undefined

      if (!events) return

      const current = this.$moment()

      return events.filter((event) => {
        if (event.attributes.dateEnd) {
          return (
            this.$moment(event.attributes.dateStart).isSameOrBefore(current) &&
            this.$moment(event.attributes.dateEnd).isAfter(current)
          )
        } else {
          return (
            this.$moment(event.attributes.dateStart).isSameOrBefore(current) &&
            this.$moment(event.attributes.dateStart).isSame(current, 'day')
          )
        }
      })
    },
    itemsFuture() {
      const events = this.items as Array<CollectionItem<CrealEvent>> | undefined

      if (!events) return

      const current = this.$moment()

      return events.filter((event) =>
        this.$moment(event.attributes.dateStart).isAfter(current)
      )
    },
    itemsPast() {
      const events = this.items as Array<CollectionItem<CrealEvent>> | undefined

      if (!events) return

      const current = this.$moment()

      return events.filter((event) => {
        if (event.attributes.dateEnd) {
          return this.$moment(event.attributes.dateEnd).isBefore(current)
        } else {
          return (
            this.$moment(event.attributes.dateStart).isBefore(current) &&
            !this.$moment(event.attributes.dateStart).isSame(current, 'day')
          )
        }
      })
    },
  },
  watchQuery: ['limit', 'start'],
})
</script>

<i18n lang="yml">
de:
  description: Veranstaltungen, bei denen cReal auftritt.
  eventsCurrent: Laufende Veranstaltungen
  eventsFuture: Zukünftige Veranstaltungen
  eventsNone: Keine Veranstaltungen gefunden.
  eventsPast: Vergangene Veranstaltungen
  titlePage: Veranstaltungen
en:
  description: Events at which cReal performs.
  eventsCurrent: Current events
  eventsFuture: Upcoming events
  eventsNone: No events found.
  eventsPast: Past events
  titlePage: Events
</i18n>
