<template>
  <div v-if="events && events.length > 0">
    <h2><slot /></h2>
    <ul>
      <li
        v-for="event in events"
        :key="event.id"
        class="relative my-4 rounded border p-4 first:mt-0 last:mb-0"
      >
        <Event :event="event.attributes" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'
import { Event as CrealEvent } from '~/components/event/Event.vue'
import { CollectionItem } from '~/plugins/paging'

export default defineComponent({
  name: 'CrealEventList',
  props: {
    events: {
      required: true,
      type: Array as PropType<Array<CollectionItem<CrealEvent>>>,
    },
  },
})
</script>
