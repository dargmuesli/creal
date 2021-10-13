<template>
  <div class="flex flex-1">
    <div
      :class="{ '-translate-y-full': !showGreeting }"
      class="
        duration-1000
        ease-in-out
        fullscreen
        transition-transform
        transform-gpu
      "
    >
      <div class="bg-gray-800 fullscreen"></div>
      <div class="bg-center bg-cover bg-creal bg-no-repeat fullscreen" />
      <div class="bg-gray-800 opacity-75 fullscreen"></div>
      <div class="fullscreen flex">
        <div class="m-auto mb-20vh text-center">
          <h1 class="inline-block border-b border-gray-400">
            {{ $t('creal') }}
          </h1>
          <p class="font-light mt-4 mb-16">{{ $t('welcome') }}</p>
          <Button aria-label="start" @click.native="setShowGreeting(true)">
            {{ $t('start') }}
          </Button>
        </div>
      </div>
    </div>
    <div
      class="
        flex-1
        gap-4
        lg:gap-8
        grid grid-cols-1
        lg:grid-cols-2
        items-stretch
      "
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  data() {
    return {
      showGreeting: true,
      title: 'Welcome!',
    }
  },
  beforeMount() {
    document.getElementsByTagName('body')[0].classList.add('overflow-hidden')
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
          document
            .getElementsByTagName('body')[0]
            .classList.remove('overflow-hidden')
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
