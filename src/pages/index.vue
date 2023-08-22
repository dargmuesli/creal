<template>
  <div class="flex flex-1">
    <div
      :class="{ '-translate-y-full': !showGreeting }"
      class="fullscreen transform-gpu transition-transform duration-1000 ease-in-out"
    >
      <div class="fullscreen bg-gray-800"></div>
      <div class="fullscreen bg-creal bg-cover bg-center bg-no-repeat" />
      <div class="fullscreen bg-gray-800 opacity-75"></div>
      <div class="fullscreen flex">
        <div class="mb-20vh m-auto text-center">
          <h1 class="inline-block border-b border-gray-400">
            {{ t('creal') }}
          </h1>
          <i18n-t
            class="mb-16 mt-4 whitespace-pre-line font-light"
            keypath="welcome"
            tag="p"
          >
            <br />
          </i18n-t>
          <ButtonColored
            aria-label="start"
            @click="setShowGreeting({ save: true })"
          >
            {{ t('start') }}
          </ButtonColored>
        </div>
      </div>
    </div>
    <div
      class="grid flex-1 grid-cols-1 items-stretch gap-4 xl:grid-cols-2 xl:gap-8"
    >
      <ButtonBig aria-label="Events" :to="localePath('/events')">
        <VioIconCalendar classes="h-16 w-16" />
        {{ t('events') }}
      </ButtonBig>
      <ButtonBig aria-label="FAQ" :to="localePath('/faq')">
        <VioIconChatOutline classes="h-16 w-16" />
        {{ t('faq') }}
      </ButtonBig>
      <ButtonBig aria-label="Player" :to="localePath('/player')">
        <VioIconMusic classes="h-16 w-16" />
        {{ t('player') }}
      </ButtonBig>
      <ButtonBig aria-label="Suggestions" :to="localePath('/suggestions')">
        <VioIconLightbulb classes="h-16 w-16" />
        {{ t('suggestions') }}
      </ButtonBig>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ colorMode: 'dark' })

const localePath = useLocalePath()
const { t } = useI18n()

// data
const showGreeting = ref(true)
const title = t('title')

// methods
const setShowGreeting = ({ save }: { save: boolean }) => {
  if (save) {
    sessionStorage.setItem('cReal_showGreeting', 'shown')
  }

  if (sessionStorage.getItem('cReal_showGreeting') !== 'shown') {
    showGreeting.value = true
  } else {
    showGreeting.value = false
    document.body.classList.remove('overflow-hidden')
  }
}

// lifecycle
onBeforeMount(() => {
  window.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      setShowGreeting({ save: true })
    }
  })
})

onMounted(() => {
  setShowGreeting({ save: false })
})

// initialization
useHead({
  bodyAttrs: {
    class: ['overflow-hidden'],
  },
})
useHeadDefault({ title })
</script>

<script lang="ts">
export default {
  name: 'IndexPage',
}
</script>

<i18n lang="yaml">
de:
  creal: cReal
  events: Veranstaltungen
  faq: FAQ
  player: Player
  start: Start
  suggestions: Vorschläge
  title: Willkommen!
  welcome: DJ und Event-Organisator,{0}manchmal am Doubletime rappen.
en:
  creal: cReal
  events: Events
  faq: FAQ
  player: Player
  start: Start
  suggestions: Suggestions
  title: Welcome!
  welcome: DJ and event organizer,{0}occasionally rapping double times.
</i18n>
