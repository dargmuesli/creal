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
      :is-next-allowed="paging.isNextAllowed"
      :is-previous-allowed="paging.isPreviousAllowed"
      :page="paging.page"
      :part-string="paging.partString"
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

// remount on pagination changes so the top-level `await` below refetches
definePageMeta({
  key: (route) => route.fullPath,
})

const {
  items: events,
  paging,
  requestError,
} = await useStrapiData<CrealEvent>({
  path: '/events',
  query: {
    'populate[image]': 'true',
    'populate[gigs][populate][image]': 'true',
    sort: 'dateStart:desc',
  },
})

const { t } = useI18n()
const now = useNow()
const typicalSetLengthMilliseconds = 2 * 60 * 60 * 1000 // 2h

// data
const title = t('titlePage')

// computations

// The event itself is always shown; gigs (if any) are its children, not a
// replacement for the event's own info.
const getEventDisplay = (
  event: CollectionItem<CrealEvent>,
): CrealGig | undefined => {
  // Event only requires title and dateStart, matching its Strapi schema.
  if (typeof event.dateStart !== 'string' || typeof event.title !== 'string') {
    return
  }

  return {
    dateEnd: event.dateEnd,
    dateStart: event.dateStart,
    description: event.description,
    image: event.image,
    location: event.location,
    title: event.title,
    url: event.url,
  }
}

type EventGroup = {
  event: CollectionItem<CrealEvent>
  eventDisplay: CrealGig
  gigs: CollectionItem<CrealGig>[]
}

// An event's own gigs may span different times, so a single event is placed
// into one section (current/future/past) by the range covering all of them.
const getEventRange = (eventGroup: EventGroup) => {
  if (!eventGroup.gigs.length) {
    return {
      dateEnd: eventGroup.eventDisplay.dateEnd,
      dateStart: eventGroup.eventDisplay.dateStart,
    }
  }

  return {
    dateEnd: new Date(
      Math.max(
        ...eventGroup.gigs.map((gig) =>
          new Date(gig.dateEnd ?? gig.dateStart).getTime(),
        ),
      ),
    ).toISOString(),
    dateStart: new Date(
      Math.min(
        ...eventGroup.gigs.map((gig) => new Date(gig.dateStart).getTime()),
      ),
    ).toISOString(),
  }
}
const isEventCurrent = (eventGroup: EventGroup) => {
  const { dateEnd, dateStart } = getEventRange(eventGroup)
  const start = new Date(dateStart)
  const startPlus2h = new Date(start.getTime() + typicalSetLengthMilliseconds)

  if (dateEnd) {
    return start <= now.value && now.value < new Date(dateEnd)
  } else {
    return start <= now.value && now.value < startPlus2h
  }
}
const isEventFuture = (eventGroup: EventGroup) =>
  now.value < new Date(getEventRange(eventGroup).dateStart)
const isEventPast = (eventGroup: EventGroup) => {
  const { dateEnd, dateStart } = getEventRange(eventGroup)
  const start = new Date(dateStart)
  const startPlus2h = new Date(start.getTime() + typicalSetLengthMilliseconds)

  if (dateEnd) {
    return new Date(dateEnd) < now.value
  } else {
    return startPlus2h < now.value
  }
}

const eventGroups = computed<EventGroup[] | undefined>(() => {
  if (!events) return

  return events
    .map((event) => {
      const eventDisplay = getEventDisplay(event)
      if (!eventDisplay) return

      return {
        event,
        eventDisplay,
        gigs: [...(event.gigs ?? [])].sort(
          (gigA, gigB) =>
            new Date(gigB.dateStart).getTime() -
            new Date(gigA.dateStart).getTime(),
        ),
      }
    })
    .filter((eventGroup): eventGroup is EventGroup => !!eventGroup)
})
const eventsCurrent = computed(() => eventGroups.value?.filter(isEventCurrent))
const eventsFuture = computed(() => {
  const futureEventGroups = eventGroups.value?.filter(isEventFuture)
  if (!futureEventGroups) return

  return futureEventGroups
    .map((eventGroup) => ({
      ...eventGroup,
      gigs: [...eventGroup.gigs].reverse(),
    }))
    .reverse()
})
const eventsPast = computed(() => eventGroups.value?.filter(isEventPast))

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
