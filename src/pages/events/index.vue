<template>
  <div class="flex-1">
    <LayoutBreadcrumbs>
      {{ title }}
    </LayoutBreadcrumbs>
    <CardStateAlert v-if="requestError">
      {{ requestError }}
    </CardStateAlert>
    <Paging
      v-else-if="events?.length"
      class="flex flex-col gap-4 lg:gap-8"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <EventList v-if="itemsCurrent" :events="itemsCurrent">
        <div class="flex items-center gap-2">
          {{ t('eventsCurrent') }}
          <LivePulse />
        </div>
      </EventList>
      <EventList v-if="itemsFuture" :events="itemsFuture">
        <div class="flex items-center gap-2">
          {{ t('eventsFuture') }}
          <LivePulse v-if="!itemsCurrent || itemsCurrent.length === 0" />
        </div>
      </EventList>
      <EventList v-if="itemsPast" :events="itemsPast">
        {{ t('eventsPast') }}
      </EventList>
    </Paging>
    <div v-else class="text-center">{{ t('eventsNone') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { StrapiResult } from '@dargmuesli/nuxt-vio/types/fetch'
import { FETCH_RETRY_AMOUNT } from '@dargmuesli/nuxt-vio/utils/constants'
import { consola } from 'consola'

import type { CrealEvent, CrealFaq } from '~/types/creal'

definePageMeta({ colorMode: 'dark' })

const { t, locale } = useI18n()
const route = useRoute()
const strapiFetch = useStrapiFetch()
const dateTime = useDateTime()

// data
const requestError = ref()
const title = t('titlePage')
const queryLimit = +(route.query.limit ? route.query.limit : 100)
const queryStart = +(route.query.start ? route.query.start : 0)

// async data
let asyncData: StrapiResult<CrealFaq> | undefined

try {
  asyncData = await strapiFetch<StrapiResult<CrealEvent>>('/events', {
    query: {
      locale: locale.value,
      'pagination[limit]': String(queryLimit),
      'pagination[start]': String(queryStart),
      populate: 'image',
      sort: 'dateStart:desc',
    },
    retry: FETCH_RETRY_AMOUNT,
  })
} catch (error: any) {
  requestError.value = error
  consola.error(error)
}
const events = asyncData?.data
const paging = getPaging({
  items: events,
  itemsCountTotal: asyncData?.meta.pagination.total,
  query: route.query,
  start: queryStart,
  limit: queryLimit,
})

// computations
const itemsCurrent = computed(() => {
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
const itemsFuture = computed(() => {
  if (!events) return

  const current = dateTime()

  return events
    .filter((event) => dateTime(event.attributes.dateStart).isAfter(current))
    .reverse()
})
const itemsPast = computed(() => {
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
  title,
  extension: {
    description: t('description'),
  },
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
