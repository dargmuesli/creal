<template>
  <header class="mb-8 gap-4">
    <nav class="flex items-center justify-between gap-4" aria-label="Global">
      <VioButton :aria-label="t('creal')" :to="localePath('/')">
        <span class="text-lg font-bold">{{ t('creal') }}</span>
        <template #prefix>
          <IconLogo class="h-10 w-10" />
        </template>
      </VioButton>
      <VioButton
        :aria-label="t('menuToggle')"
        class="justify-center rounded-md p-2.5 text-gray-400 lg:hidden"
        @click="mobileMenuOpen = true"
      >
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </VioButton>
      <div class="hidden gap-16 text-xl lg:flex">
        <VioLink
          aria-label="Events"
          :is-colored="false"
          :to="localePath('/events')"
        >
          {{ t('events') }}
        </VioLink>
        <VioLink
          aria-label="FAQ"
          :is-colored="false"
          :to="localePath('/testimonials')"
        >
          {{ t('testimonials') }}
        </VioLink>
        <VioLink
          aria-label="Player"
          :is-colored="false"
          :to="localePath('/player')"
        >
          {{ t('player') }}
        </VioLink>
        <VioLink
          aria-label="Suggestions"
          :is-colored="false"
          :to="localePath('/suggestions')"
        >
          {{ t('suggestions') }}
        </VioLink>
      </div>
      <!-- <VioLink
      v-if="eventsCurrentCount"
      class="flex items-center gap-2 rounded-full border px-4 py-2 font-bold focus:rounded-full sm:px-4"
      :is-colored="false"
      :to="localePath('/events')"
    >
      <LivePulse />
      <span class="hidden whitespace-nowrap sm:inline">
        {{ t('live') }}
      </span>
    </VioLink>
    <VioLink
      v-else-if="eventsFutureCount"
      class="flex items-center gap-2 rounded-full border px-2 py-2 font-bold focus:rounded-full sm:px-4"
      :is-colored="false"
      :to="localePath('/events')"
    >
      <LivePulse />
      <span class="hidden whitespace-nowrap sm:inline">
        {{ t('eventsFuture') }}
      </span>
    </VioLink> -->
      <LinkBooking class="hidden text-lg font-bold lg:flex" />
    </nav>
    <Dialog
      as="div"
      class="lg:hidden"
      :open="mobileMenuOpen"
      @close="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 z-50" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
      >
        <div class="flex items-center justify-between">
          <VioButton :aria-label="t('creal')" :to="localePath('/')">
            <span class="text-lg font-bold">{{ t('creal') }}</span>
            <template #prefix>
              <IconLogo class="h-10 w-10" />
            </template>
          </VioButton>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-400"
            @click="mobileMenuOpen = false"
          >
            <!-- <span class="sr-only">Close menu</span> -->
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/25">
            <div class="space-y-2 py-6">
              <VioLink
                aria-label="Events"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                :is-colored="false"
                :to="localePath('/events')"
              >
                {{ t('events') }}
              </VioLink>
              <VioLink
                aria-label="FAQ"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                :is-colored="false"
                :to="localePath('/testimonials')"
              >
                {{ t('testimonials') }}
              </VioLink>
              <VioLink
                aria-label="Player"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                :is-colored="false"
                :to="localePath('/player')"
              >
                {{ t('player') }}
              </VioLink>
              <VioLink
                aria-label="Suggestions"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                :is-colored="false"
                :to="localePath('/suggestions')"
              >
                {{ t('suggestions') }}
              </VioLink>
              <!-- <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                >{{ item.name }}</a
              > -->
            </div>
            <div class="py-6">
              <LinkBooking
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const localePath = useLocalePath()
// const strapiFetch = useStrapiFetch()
// const dateTime = useDateTime()

// async data
// let eventsCurrentCount = 0
// let eventsFutureCount = 0

// data
const mobileMenuOpen = ref(false)
// const now = dateTime()

// // methods
// const init = async () => {
//   eventsCurrentCount = (
//     (await strapiFetch('/events', {
//       query: {
//         'filters[$and][0][dateStart][$lte]': now.toISOString(),
//         'filters[$and][1][$or][0][dateEnd][$gt]': now.toISOString(),
//         'filters[$and][1][$or][1][dateStart][$gte]': now
//           .startOf('day')
//           .toISOString(),
//       },
//     })) as any
//   ).meta.pagination.total
//   eventsFutureCount = (
//     (await strapiFetch('/events', {
//       query: {
//         'filters[dateStart][$gt]': now.toISOString(),
//       },
//     })) as any
//   ).meta.pagination.total
// }

// // initialization
// try {
//   await init()
// } catch (error: any) {}
</script>

<i18n lang="yaml">
de:
  creal: cReal
  events: Veranstaltungen
  # eventsFuture: Kommende Veranstaltungen
  # faq: FAQ
  # live: Live
  menuToggle: Menü umschalten
  player: Mixe
  suggestions: Vorschläge
  testimonials: Testimonials
en:
  creal: cReal
  events: Events
  # eventsFuture: Upcoming events
  # faq: FAQ
  # live: Live
  menuToggle: Toggle menu
  player: Mixes
  suggestions: Suggestions
  testimonials: Testimonials
</i18n>
