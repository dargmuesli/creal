<template>
  <div v-if="events?.length" class="flex flex-col gap-8">
    <div class="text-3xl font-bold text-white lg:text-4xl">
      <slot />
    </div>
    <ul class="flex flex-col">
      <li
        v-for="(crealEvent, index) in events"
        :key="crealEvent.documentId"
        class="relative"
      >
        <Event :creal-event :index />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/shared/types/fetch'

interface Props {
  events: CollectionItem<CrealEvent>[]
}
withDefaults(defineProps<Props>(), {})
</script>
