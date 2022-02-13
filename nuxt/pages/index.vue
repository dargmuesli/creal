<template>
  <div class="flex flex-1">
    <div
      :class="{ '-translate-y-full': !showGreeting }"
      class="fullscreen transform-gpu transition-transform duration-1000 ease-in-out"
    >
      <div class="fullscreen bg-gray-800"></div>
      <div class="bg-creal fullscreen bg-cover bg-center bg-no-repeat" />
      <div class="fullscreen bg-gray-800 opacity-75"></div>
      <div class="fullscreen flex">
        <div class="m-auto text-center mb-20vh">
          <h1 class="inline-block border-b border-gray-400">
            {{ $t('creal') }}
          </h1>
          <p class="mt-4 mb-16 font-light">{{ $t('welcome') }}</p>
          <Button aria-label="start" @click.native="setShowGreeting(true)">
            {{ $t('start') }}
          </Button>
        </div>
      </div>
    </div>
    <div
      class="grid flex-1 grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-8"
    >
      <ButtonBig
        aria-label="Events"
        :to="localePath('/events')"
        :icon-id="['fas', 'calendar-day']"
      >
        {{ $t('events') }}
      </ButtonBig>
      <ButtonBig
        aria-label="FAQ"
        :to="localePath('/faq')"
        :icon-id="['fas', 'comments']"
      >
        {{ $t('faq') }}
      </ButtonBig>
      <ButtonBig
        aria-label="Player"
        :to="localePath('/player')"
        :icon-id="['fas', 'music']"
      >
        {{ $t('player') }}
      </ButtonBig>
      <ButtonBig
        aria-label="Suggestions"
        :to="localePath('/suggestions')"
        :icon-id="['fas', 'lightbulb']"
      >
        {{ $t('suggestions') }}
      </ButtonBig>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '#app'

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {
      showGreeting: true,
      title: 'Welcome!',
    }
  },
  head() {
    const title = this.title as string
    return {
      bodyAttrs: {
        class: this.showGreeting ? ['overflow-hidden'] : [],
      },
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.$baseUrl + this.$router.currentRoute.fullPath,
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: title,
        },
      ],
      title,
    }
  },
  beforeMount() {
    window.addEventListener('keypress', (e) => {
      const key = e.which || e.keyCode

      if (key === 13) {
        this.setShowGreeting(true)
      }
    })
  },
  mounted() {
    this.setShowGreeting(false)
  },
  methods: {
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
    },
  },
})
</script>

<i18n lang="yml">
de:
  creal: cReal
  events: Veranstaltungen
  faq: FAQ
  player: Player
  start: Start
  suggestions: Vorschläge
  welcome: Willkommen auf meiner Website
en:
  creal: cReal
  events: Events
  faq: FAQ
  player: Player
  start: Start
  suggestions: Suggestions
  welcome: Welcome to my website
</i18n>
