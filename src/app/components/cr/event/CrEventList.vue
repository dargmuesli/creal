<template>
  <div v-if="eventGroups?.length" class="flex flex-col gap-8">
    <div class="text-3xl font-bold text-white lg:text-4xl">
      <slot />
    </div>
    <ul class="flex flex-col gap-12">
      <li
        v-for="eventGroup in eventGroups"
        :key="eventGroup.event.documentId"
        class="flex flex-col gap-4"
      >
        <h2 class="text-2xl font-bold text-white lg:text-3xl">
          {{ eventGroup.event.title || eventGroup.gigs[0]?.title || '' }}
        </h2>
        <ul class="flex flex-col">
          <li
            v-for="(gig, index) in eventGroup.gigs"
            :key="gig.documentId"
            class="relative"
          >
            <CrEvent :creal-event="gig" :index />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/shared/types/fetch'

type EventGroup = {
  event: CollectionItem<CrealEvent>
  gigs: CollectionItem<CrealGig>[]
}

const { eventGroups } = defineProps<{
  eventGroups: EventGroup[]
}>()
</script>
