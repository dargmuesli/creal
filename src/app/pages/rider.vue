<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <div class="flex flex-col gap-16">
      <p class="text-lg leading-8 text-gray-300">{{ t('intro') }}</p>
      <div class="grid gap-4 lg:grid-cols-2 lg:gap-8">
        <VioCard
          v-for="(section, index) in sections"
          :key="section.heading"
          background-color="bg-gray-900"
          class="flex flex-col gap-4 lg:p-8"
          :class="{ 'lg:col-span-2': index === 0 }"
        >
          <div class="flex items-center gap-4">
            <component
              :is="section.icon"
              aria-hidden="true"
              class="size-8 shrink-0 text-yellow-500"
            />
            <h2>{{ section.heading }}</h2>
          </div>
          <ul
            class="flex flex-col gap-2"
            :class="{ 'lg:grid lg:grid-cols-3 lg:gap-8': index === 0 }"
          >
            <li v-for="item in section.items" :key="item" class="flex gap-2">
              <CheckIcon
                aria-hidden="true"
                class="size-6 shrink-0 text-yellow-500"
              />
              <span>{{ item }}</span>
            </li>
          </ul>
        </VioCard>
      </div>
      <CrBookingCta :text="t('ctaText')" :title="t('ctaTitle')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BoltIcon,
  BriefcaseIcon,
  CheckIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()

// data
const sections = [
  {
    heading: t('bring'),
    icon: BriefcaseIcon,
    items: [t('bringController'), t('bringMedia'), t('bringHeadphones')],
  },
  {
    heading: t('audio'),
    icon: SpeakerWaveIcon,
    items: [t('audioMaster'), t('audioMonitor'), t('audioCables')],
  },
  {
    heading: t('booth'),
    icon: BoltIcon,
    items: [
      t('boothTable'),
      t('boothPower'),
      t('boothBattery'),
      t('boothWeather'),
    ],
  },
  {
    heading: t('setup'),
    icon: WrenchScrewdriverIcon,
    items: [t('setupPlay'), t('setupSoundcheck')],
  },
  {
    heading: t('optional'),
    icon: SparklesIcon,
    items: [t('optionalMicrophone'), t('optionalStreaming')],
  },
]
const title = t('title')

// initialization
useCrealHeadDefault({
  description: t('description'),
  title,
})
</script>

<i18n lang="yaml">
de:
  audio: Ton
  audioCables: Alle Kabel zur Anlage und zum Monitor stellt die Location.
  audioMaster: Anschluss an die Anlage über 2× XLR (symmetrisch, bevorzugt) oder 2× Cinch (unsymmetrisch).
  audioMonitor: "Mindestens ein Monitor am DJ Pult, angeschlossen an den Booth Ausgang (2× 6,35\u00A0mm Klinke, symmetrisch)."
  booth: DJ Pult
  boothBattery: "Als Rückfall ist Akkubetrieb möglich, für Sets bis zu 2\u00A0Stunden problemlos."
  boothPower: "Eine geerdete 230\u00A0V Steckdose, der Controller braucht höchstens 30\u00A0W."
  boothTable: "Ein stabiler, ebener Tisch mit mindestens 50\u00A0×\u00A035\u00A0cm Fläche."
  boothWeather: Draußen eine Überdachung für das DJ Pult.
  bring: Das bringe ich mit
  bringController: Denon DJ Prime GO+ (standalone, kein Laptop nötig)
  bringHeadphones: Kopfhörer
  bringMedia: Musik auf USB Sticks
  ctaText: Schreib mir, dann klären wir die Details!
  ctaTitle: Alles dabei?
  description: Technische Anforderungen für Auftritte von DJ cReal.
  intro: Hier steht, was ich zum Auflegen brauche. Falls etwas davon nicht möglich ist, melde dich gerne vor dem Termin, dann finden wir eine Lösung.
  optional: Auf Wunsch
  optionalMicrophone: "Mikrofon für Ansagen, anschließbar über XLR oder 6,35\u00A0mm Klinke."
  optionalStreaming: Musikstreaming, falls WLAN verfügbar ist.
  setup: Aufbau
  setupPlay: Einstecken und loslegen ist möglich, auch ohne Stromanschluss.
  setupSoundcheck: Ein Soundcheck vor der Veranstaltung ist mir lieber.
  title: Technischer Rider
en:
  audio: Audio
  audioCables: All cables to the PA and monitor are provided by the venue.
  audioMaster: Connection to the PA via 2× XLR (balanced, preferred) or 2× RCA (unbalanced).
  audioMonitor: "At least one booth monitor, connected to the booth output (2× 6.35\u00A0mm jack, balanced)."
  booth: Booth
  boothBattery: "Battery operation works as a fallback, reliably for sets of up to 2\u00A0hours."
  boothPower: "One grounded 230\u00A0V socket, the controller draws 30\u00A0W at most."
  boothTable: "A stable, level table with at least 50\u00A0×\u00A035\u00A0cm of space."
  boothWeather: Outdoors, a roof or cover over the booth.
  bring: What I bring
  bringController: Denon DJ Prime GO+ (standalone, no laptop needed)
  bringHeadphones: Headphones
  bringMedia: Music on USB sticks
  ctaText: Get in touch and we'll sort out the details!
  ctaTitle: All set?
  description: Technical requirements for performances by DJ cReal.
  intro: This rider lists what I need to play. If something can't be provided, just get in touch before the gig and we'll find a solution.
  optional: On request
  optionalMicrophone: "Microphone for announcements, connected via XLR or 6.35\u00A0mm jack."
  optionalStreaming: Music streaming, if Wi-Fi is available.
  setup: Setup
  setupPlay: Plug and play is possible, even without a power connection.
  setupSoundcheck: A soundcheck before the event is preferred.
  title: Technical rider
</i18n>
