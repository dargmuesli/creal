<template>
  <div v-if="events?.length" class="flex flex-col gap-2 lg:gap-4">
    <div class="vio-prose-fullwidth">
      <div class="text-5xl font-bold text-white"><slot /></div>
    </div>
    <ul class="flex flex-col gap-4 lg:gap-8">
      <Event
        v-for="eventItem in events"
        :key="eventItem.id"
        :creal-event="eventItem.attributes"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/types/fetch'

import type { CrealEvent } from '~/types/creal'

interface Props {
  events: Array<CollectionItem<CrealEvent>>
}
withDefaults(defineProps<Props>(), {})
</script>
