<template>
  <div>
    <div
      :class="{ '-translate-y-full': !showGreeting }"
      class="duration-1000 ease-in-out fullscreen transform"
    >
      <div class="bg-gray-800 fullscreen"></div>
      <div
        class="bg-center bg-cover transition-opacity bg-no-repeat fullscreen"
        style="background-image: url('/creal.jpg');"
      ></div>
      <div class="bg-gray-800 opacity-75 fullscreen"></div>
      <div class="fullscreen flex">
        <div class="m-auto text-center" style="margin-bottom: 20vh;">
          <h1 class="inline-block border-b border-gray-400">
            cReal
          </h1>
          <p class="font-light mt-4 mb-16">
            Welcome to my website
          </p>
          <Button @click.native="showGreeting = false">start</Button>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script lang="ts">
import Button from '~/components/Button.vue'

export default {
  components: {
    Button,
  },
  data() {
    return {
      showGreeting: true,
    }
  },
}
</script>
