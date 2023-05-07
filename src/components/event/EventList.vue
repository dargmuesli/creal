<template>
  <div v-if="events?.length" class="flex flex-col gap-2 lg:gap-4">
    <div class="vio-prose-fullwidth">
      <div class="text-5xl font-bold text-white"><slot /></div>
    </div>
    <ul>
      <li
        v-for="eventItem in events"
        :key="eventItem.id"
        class="relative my-4 rounded border p-4 first:mt-0 last:mb-0"
      >
        <Event :creal-event="eventItem.attributes" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '~/types/paging'
import type { CrealEvent } from '~/types/creal'

export interface Props {
  events: Array<CollectionItem<CrealEvent>>
}
withDefaults(defineProps<Props>(), {})
</script>
