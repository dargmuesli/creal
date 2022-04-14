<template>
  <header class="flex items-center justify-between gap-4 p-4 md:px-8">
    <AppLink :to="localePath('/')">
      <div id="logo" class="h-10 w-10" />
      <span class="text-lg font-bold">{{ $t('creal') }}</span>
    </AppLink>
    <AppLink
      v-if="eventsCurrentCount"
      class="flex items-center gap-2 rounded-full border px-4 py-2 font-bold focus:rounded-full"
      :to="localePath('/events')"
    >
      {{ $t('live') }}
      <LivePulse />
    </AppLink>
    <AppLink
      v-else-if="eventsFutureCount"
      class="flex items-center gap-2 rounded-full border px-4 py-2 font-bold focus:rounded-full"
      :to="localePath('/events')"
    >
      {{ $t('eventsFuture') }}
      <LivePulse />
    </AppLink>
    <AppLink
      class="flex gap-2 text-lg font-bold"
      :is-colored="false"
      :to="`mailto:e-mail+creal@jonas-thelemann.de?subject=${encodeURIComponent(
        $t('bookingSubject')
      )}`"
    >
      {{ $t('bookCreal') }}
      <IconArrowRight />
    </AppLink>
  </header>
</template>

<script lang="ts">
import { defineComponent } from '#app'

export default defineComponent({
  name: 'CrealHeader',
  data() {
    return {
      eventsCurrentCount: undefined,
      eventsFutureCount: undefined,
    }
  },
  async fetch() {
    this.eventsCurrentCount = (
      (await this.$http.$get('/events', {
        searchParams: new URLSearchParams({
          'filters[$and][0][dateStart][$lte]': this.$moment().toISOString(),
          'filters[$and][1][$or][0][dateEnd][$gt]':
            this.$moment().toISOString(),
          'filters[$and][1][$or][1][dateStart][$gte]': this.$moment()
            .startOf('day')
            .toISOString(),
        }),
      })) as any
    ).meta.pagination.total
    this.eventsFutureCount = (
      (await this.$http.$get('/events', {
        searchParams: new URLSearchParams({
          'filters[dateStart][$gt]': this.$moment().toISOString(),
        }),
      })) as any
    ).meta.pagination.total
  },
  methods: {
    click() {
      ;(this.$refs.button as HTMLButtonElement).click()
    },
  },
})
</script>

<style scoped>
#logo {
  background-image: url('/assets/static/logos/creal.svg');
  background-repeat: round;
}
</style>

<i18n lang="yml">
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
