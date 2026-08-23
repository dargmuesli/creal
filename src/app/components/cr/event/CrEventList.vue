<template>
  <div v-if="eventGroups?.length" class="flex flex-col gap-8">
    <div class="text-3xl font-bold text-white lg:text-4xl">
      <slot />
    </div>
    <ul class="flex flex-col gap-12">
      <li
        v-for="(eventGroup, index) in eventGroups"
        :key="eventGroup.event.documentId"
        class="relative"
      >
        <CrEvent
          :creal-event="eventGroup.eventDisplay"
          :gigs="eventGroup.gigs"
          :index
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/shared/types/fetch'

type EventGroup = {
  event: CollectionItem<CrealEvent>
  eventDisplay: CrealGig
  gigs: CollectionItem<CrealGig>[]
}

const { eventGroups } = defineProps<{
  eventGroups: EventGroup[]
}>()
</script>
