<template>
  <div class="relative flex flex-1 items-end justify-center">
    <div class="mb-[15vh] max-w-2xl">
      <div class="mb-8 flex justify-center">
        <div
          class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 backdrop-blur-md hover:ring-white/20"
        >
          {{ t('cities') }}
          <VioLink
            :to="localePath('/events')"
            :is-colored="false"
            class="font-semibold text-white"
          >
            <span class="absolute inset-0" aria-hidden="true" />
            {{ t('viewAll') }}
            <span aria-hidden="true">{{ t('arrow') }}</span>
          </VioLink>
        </div>
      </div>
      <div class="text-center">
        <h1 class="text-6xl font-bold tracking-tight text-white">
          {{ t('cReal') }}
        </h1>
        <i18n-t
          class="mt-6 text-lg leading-8 text-gray-300"
          keypath="welcome"
          tag="p"
        >
          <template #newline>
            <br />
          </template>
        </i18n-t>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <VioButtonColored
            :aria-label="t('testimonialsRead')"
            class="text-sm font-semibold shadow-xs"
            :to="localePath('/testimonials')"
          >
            {{ t('testimonialsRead') }}
          </VioButtonColored>
          <LinkBooking class="text-sm leading-6 font-semibold" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'root',
})

const localePath = useLocalePath()
const { t } = useI18n()

// initialization
useHeadDefault({})
</script>

<script lang="ts">
export default {
  name: 'IndexPage',
}
</script>

<i18n lang="yaml">
de:
  arrow: →
  cities: Köln, Karlsruhe, Frankfurt, Kassel, …
  cReal: cReal
  testimonialsRead: Erfahrungsberichte lesen
  viewAll: Alle anzeigen
  welcome: DJ und Event-Organisator,{newline}manchmal am Doubletime rappen.
en:
  arrow: →
  cities: Cologne, Karlsruhe, Frankfurt, Kassel, …
  cReal: cReal
  testimonialsRead: Read testimonials
  viewAll: View all
  welcome: DJ and event organizer,{newline}occasionally rapping double times.
</i18n>
