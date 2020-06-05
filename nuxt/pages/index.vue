<template>
  <div class="container mx-auto">
    <!-- <section>
      <a v-if="event.url !== null" :href="event.url" target="_blank">
        <EventAnnouncement :event="event" />
      </a>
      <EventAnnouncement v-else :event="event" />
    </section> -->
    <section>
      <Button :link="'/events'">Events</Button>
    </section>
  </div>
</template>

<script lang="ts">
import Button from '~/components/Button.vue'

export default {
  components: {
    Button,
  },
}
</script>
