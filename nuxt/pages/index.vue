<template>
  <div>
    <div
      :class="{ '-translate-y-full': !showGreeting }"
      class="duration-1000 ease-in-out fullscreen transform"
    >
      <div class="bg-gray-800 fullscreen"></div>
      <div
        class="bg-center bg-cover bg-creal transition-opacity bg-no-repeat fullscreen"
      ></div>
      <div class="bg-gray-800 opacity-75 fullscreen"></div>
      <div class="fullscreen flex">
        <div class="m-auto mb-20vh text-center">
          <h1 class="inline-block border-b border-gray-400">cReal</h1>
          <p class="font-light mt-4 mb-16">Welcome to my website</p>
          <Button :icon="false" @click.native="setShowGreeting(true)">
            start
          </Button>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <!-- <section>
        <a
          v-if="event.url !== null"
          :href="event.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <EventAnnouncement :event="event" />
        </a>
        <EventAnnouncement v-else :event="event" />
      </section> -->
      <ButtonBig :link="'/events'" :icon-id="'calendar-day'">
        Events
      </ButtonBig>
      <ButtonBig :link="'/faq'" :icon-id="'comments'">FAQ</ButtonBig>
      <ButtonBig :link="'/player'" :icon-id="'music'">Player</ButtonBig>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  head: {
    title: 'Welcome!',
  },
})
export default class extends Vue {
  showGreeting = true

  beforeMount() {
    window.addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode

      if (key === 13) {
        this.setShowGreeting(true)
      }
    })
  }

  mounted() {
    this.setShowGreeting(false)
  }

  setShowGreeting(set: boolean): void {
    if (set) {
      sessionStorage.setItem('cReal_showGreeting', 'shown')
    }

    if (process.client) {
      if (sessionStorage.getItem('cReal_showGreeting') !== 'shown') {
        this.showGreeting = true
      } else {
        this.showGreeting = false
      }
    } else {
      this.showGreeting = true
    }
  }
}
</script>
