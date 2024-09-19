<template>
  <div v-if="events?.length" class="flex flex-col gap-8">
    <div class="text-3xl font-bold text-white lg:text-4xl"><slot /></div>
    <ul class="flex flex-col gap-4 lg:gap-8">
      <li v-for="eventItem in events" :key="eventItem.documentId">
        <Event :creal-event="eventItem" />
      </li>
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
