<template>
  <header class="mb-8 flex items-center justify-between gap-4">
    <Button :aria-label="t('creal')" :to="localePath('/')">
      <span class="text-lg font-bold">{{ t('creal') }}</span>
      <template #prefix>
        <IconLogo class="h-10 w-10" />
      </template>
    </Button>
    <AppLink
      v-if="eventsCurrentCount"
      class="flex items-center gap-2 rounded-full border px-4 py-2 font-bold focus:rounded-full sm:px-4"
      :is-colored="false"
      :to="localePath('/events')"
    >
      <LivePulse />
      <span class="hidden whitespace-nowrap sm:inline">
        {{ t('live') }}
      </span>
    </AppLink>
    <AppLink
      v-else-if="eventsFutureCount"
      class="flex items-center gap-2 rounded-full border px-2 py-2 font-bold focus:rounded-full sm:px-4"
      :is-colored="false"
      :to="localePath('/events')"
    >
      <LivePulse />
      <span class="hidden whitespace-nowrap sm:inline">
        {{ t('eventsFuture') }}
      </span>
    </AppLink>
    <Button
      :aria-label="t('bookCreal')"
      class="basis-0 text-lg font-bold"
      :is-colored="false"
      :to="`mailto:e-mail+creal@jonas-thelemann.de?subject=${encodeURIComponent(
        t('bookingSubject'),
      )}`"
    >
      <span class="basis-0 whitespace-nowrap">{{ t('bookCreal') }}</span>
      <template #suffix>
        <IconArrowRight />
      </template>
    </Button>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const strapiFetch = useStrapiFetch()
const dateTime = useDateTime()

// async data
let eventsCurrentCount = 0
let eventsFutureCount = 0

// data
const now = dateTime()

// methods
const init = async () => {
  eventsCurrentCount = (
    (await strapiFetch('/events', {
      query: {
        'filters[$and][0][dateStart][$lte]': now.toISOString(),
        'filters[$and][1][$or][0][dateEnd][$gt]': now.toISOString(),
        'filters[$and][1][$or][1][dateStart][$gte]': now
          .startOf('day')
          .toISOString(),
      },
    })) as any
  ).meta.pagination.total
  eventsFutureCount = (
    (await strapiFetch('/events', {
      query: {
        'filters[dateStart][$gt]': now.toISOString(),
      },
    })) as any
  ).meta.pagination.total
}

// initialization
try {
  await init()
} catch (error: any) {}
</script>

<script lang="ts">
export default {
  name: 'VioHeader',
}
</script>

<i18n lang="yaml">
en:
  bookCreal: Book cReal
  bookingSubject: Booking Request
  creal: cReal
  eventsFuture: Upcoming events
  live: Live
de:
  bookCreal: cReal buchen
  bookingSubject: Buchungsanfrage
  creal: cReal
  eventsFuture: Kommende Veranstaltungen
  live: Live
</i18n>
