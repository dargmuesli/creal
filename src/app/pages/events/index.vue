<template>
  <div class="min-w-0 flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <CrPaging
      v-else-if="eventGroups?.length && paging"
      class="flex flex-col gap-16"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <CrEventList v-if="eventsCurrent" :event-groups="eventsCurrent">
        <div class="flex items-center gap-2">
          {{ t('eventsCurrent') }}
          <CrLivePulse />
        </div>
      </CrEventList>
      <CrEventList v-if="eventsFuture" :event-groups="eventsFuture">
        {{ t('eventsFuture') }}
      </CrEventList>
      <CrEventList v-if="eventsPast" :event-groups="eventsPast">
        {{ t('eventsPast') }}
      </CrEventList>
    </CrPaging>
    <div v-else class="text-center">{{ t('eventsNone') }}</div>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/shared/types/fetch'

const {
  items: events,
  paging,
  requestError,
} = await useStrapiData<CrealEvent>({
  path: '/events',
  query: {
    populate: 'image',
    'populate[gigs][populate]': 'image',
    sort: 'dateStart:desc',
  },
})

const { t } = useI18n()
const now = useNow()
const typicalSetLengthMilliseconds = 2 * 60 * 60 * 1000 // 2h

// data
const title = t('titlePage')

// computations
const transformLegacyEvent = (
  event: CollectionItem<CrealEvent>,
): CollectionItem<CrealGig> | undefined => {
  if (
    typeof event.dateStart !== 'string' ||
    (typeof event.dateEnd !== 'undefined' &&
      typeof event.dateEnd !== 'string') ||
    typeof event.location !== 'string' ||
    typeof event.title !== 'string' ||
    typeof event.description !== 'string' ||
    typeof event.url !== 'string' ||
    !event.image ||
    typeof event.image.url !== 'string'
  ) {
    return
  }

  return {
    dateEnd: event.dateEnd,
    dateStart: event.dateStart,
    description: event.description,
    documentId: event.documentId,
    id: event.id,
    image: event.image,
    location: event.location,
    title: event.title,
    url: event.url,
  }
}

type EventGroup = {
  event: CollectionItem<CrealEvent>
  gigs: CollectionItem<CrealGig>[]
}

const isGigCurrent = (gig: CollectionItem<CrealGig>) => {
  const dateStart = new Date(gig.dateStart)
  const dateStartPlus2h = new Date(
    dateStart.getTime() + typicalSetLengthMilliseconds,
  )

  if (gig.dateEnd) {
    return dateStart <= now.value && now.value < new Date(gig.dateEnd)
  } else {
    return dateStart <= now.value && now.value < dateStartPlus2h
  }
}
const isGigFuture = (gig: CollectionItem<CrealGig>) =>
  now.value < new Date(gig.dateStart)
const isGigPast = (gig: CollectionItem<CrealGig>) => {
  const dateStart = new Date(gig.dateStart)
  const dateStartPlus2h = new Date(
    dateStart.getTime() + typicalSetLengthMilliseconds,
  )

  if (gig.dateEnd) {
    return new Date(gig.dateEnd) < now.value
  } else {
    return dateStartPlus2h < now.value
  }
}

const eventGroups = computed<EventGroup[] | undefined>(() => {
  if (!events) return

  return events
    .map((event) => {
      if (event.gigs?.length) {
        return {
          event,
          gigs: [...event.gigs].sort(
            (gigA, gigB) =>
              new Date(gigB.dateStart).getTime() -
              new Date(gigA.dateStart).getTime(),
          ),
        }
      }

      const legacyGig = transformLegacyEvent(event)
      return { event, gigs: legacyGig ? [legacyGig] : [] }
    })
    .filter((eventGroup) => eventGroup.gigs.length)
})
const getFilteredEventGroups = (
  filterGig: (gig: CollectionItem<CrealGig>) => boolean,
) => {
  if (!eventGroups.value) return

  return eventGroups.value
    .map((eventGroup) => ({
      ...eventGroup,
      gigs: eventGroup.gigs.filter(filterGig),
    }))
    .filter((eventGroup) => eventGroup.gigs.length)
}
const eventsCurrent = computed(() => getFilteredEventGroups(isGigCurrent))
const eventsFuture = computed(() => {
  const futureEventGroups = getFilteredEventGroups(isGigFuture)
  if (!futureEventGroups) return

  return futureEventGroups
    .map((eventGroup) => ({
      ...eventGroup,
      gigs: [...eventGroup.gigs].reverse(),
    }))
    .reverse()
})
const eventsPast = computed(() => getFilteredEventGroups(isGigPast))

// initialization
useCrealHeadDefault({
  description: t('description'),
  title,
})
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
