<template>
  <div class="min-w-0 flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <VioCardStateAlert v-if="requestError">
      {{ requestError }}
    </VioCardStateAlert>
    <CrPaging
      v-else-if="events?.length && paging"
      class="flex flex-col gap-16"
      :is-previous-allowed="paging.isPreviousAllowed"
      :is-next-allowed="paging.isNextAllowed"
      :part-string="paging.partString"
      :query-previous="paging.queryPrevious"
      :query-next="paging.queryNext"
    >
      <CrEventList v-if="eventsCurrent" :events="eventsCurrent">
        <div class="flex items-center gap-2">
          {{ t('eventsCurrent') }}
          <CrLivePulse />
        </div>
      </CrEventList>
      <CrEventList v-if="eventsFuture" :events="eventsFuture">
        {{ t('eventsFuture') }}
      </CrEventList>
      <CrEventList v-if="eventsPast" :events="eventsPast">
        {{ t('eventsPast') }}
      </CrEventList>
    </CrPaging>
    <div v-else class="text-center">{{ t('eventsNone') }}</div>
  </div>
</template>

<script setup lang="ts">
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
const now = useNow()
const typicalSetLengthMilliseconds = 2 * 60 * 60 * 1000 // 2h

// data
const title = t('titlePage')

// computations
const eventsCurrent = computed(() => {
  if (!events) return

  return events.filter((event) => {
    const dateStart = new Date(event.dateStart)
    const dateStartPlus2h = new Date(
      dateStart.getTime() + typicalSetLengthMilliseconds,
    )

    if (event.dateEnd) {
      return dateStart <= now.value && now.value < new Date(event.dateEnd)
    } else {
      return dateStart <= now.value && now.value < dateStartPlus2h
    }
  })
})
const eventsFuture = computed(() => {
  if (!events) return

  return events
    .filter((event) => now.value < new Date(event.dateStart))
    .reverse()
})
const eventsPast = computed(() => {
  if (!events) return

  return events.filter((event) => {
    const dateStart = new Date(event.dateStart)
    const dateStartPlus2h = new Date(
      dateStart.getTime() + typicalSetLengthMilliseconds,
    )

    if (event.dateEnd) {
      return new Date(event.dateEnd) < now.value
    } else {
      return dateStartPlus2h < now.value
    }
  })
})

// initialization
useHeadDefault({
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
