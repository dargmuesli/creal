<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <Paging
      v-else-if="events?.length"
      class="flex flex-col gap-4 lg:gap-8"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <EventList v-if="eventsCurrent" :events="eventsCurrent">
        <div class="flex items-center gap-2">
          {{ t('eventsCurrent') }}
          <LivePulse />
        </div>
      </EventList>
      <EventList v-if="eventsFuture" :events="eventsFuture">
        <div class="flex items-center gap-2">
          {{ t('eventsFuture') }}
          <LivePulse v-if="!eventsCurrent || eventsCurrent.length === 0" />
        </div>
      </EventList>
      <EventList v-if="eventsPast" :events="eventsPast">
        {{ t('eventsPast') }}
      </EventList>
    </Paging>
    <div v-else class="text-center">{{ t('eventsNone') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { CrealEvent } from '~/types/creal'

const {
  items: events,
  paging,
  requestError,
} = await useStrapiData<CrealEvent>({
  path: '/events',
  query: {
    populate: 'image',
    sort: 'dateStart:desc',
  },
})

const { t } = useI18n()
const dateTime = useDateTime()

// data
const title = t('titlePage')

// computations
const eventsCurrent = computed(() => {
  if (!events) return

  const current = dateTime()

  return events.filter((event) => {
    if (event.attributes.dateEnd) {
      return (
        dateTime(event.attributes.dateStart).isSameOrBefore(current) &&
        dateTime(event.attributes.dateEnd).isAfter(current)
      )
    } else {
      return (
        dateTime(event.attributes.dateStart).isSameOrBefore(current) &&
        dateTime(event.attributes.dateStart).isSame(current, 'day')
      )
    }
  })
})
const eventsFuture = computed(() => {
  if (!events) return

  const current = dateTime()

  return events
    .filter((event) => dateTime(event.attributes.dateStart).isAfter(current))
    .reverse()
})
const eventsPast = computed(() => {
  if (!events) return

  const current = dateTime()

  return events.filter((event) => {
    if (event.attributes.dateEnd) {
      return dateTime(event.attributes.dateEnd).isBefore(current)
    } else {
      return (
        dateTime(event.attributes.dateStart).isBefore(current) &&
        !dateTime(event.attributes.dateStart).isSame(current, 'day')
      )
    }
  })
})
// watchQuery: ['limit', 'start'],

// initialization
useHeadDefault({
  description: t('description'),
  title,
})
</script>

<script lang="ts">
export default {
  name: 'IndexPage',
}
</script>

<i18n lang="yaml">
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
