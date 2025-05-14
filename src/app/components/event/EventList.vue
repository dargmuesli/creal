<template>
  <div v-if="events?.length" class="flex flex-col gap-8">
    <div class="text-3xl font-bold text-white lg:text-4xl">
      <slot />
    </div>
    <ul class="flex flex-col">
      <li
        v-for="(eventItem, index) in events"
        :key="eventItem.documentId"
        class="relative"
      >
        <Event :creal-event="eventItem" />
        <div class="absolute top-2.5 -right-1">
          <LivePulse
            v-if="
              index === 0 &&
              (eventItem.dateEnd
                ? dateTime().isBefore(eventItem.dateEnd)
                : dateTime().isBefore(eventItem.dateStart))
            "
          />
        </div>
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

const dateTime = useDateTime()
</script>
