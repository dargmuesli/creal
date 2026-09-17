<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <div class="flex flex-col gap-8">
      <p>{{ t('intro') }}</p>
      <section v-for="section in sections" :key="section.heading">
        <h2>{{ section.heading }}</h2>
        <ul class="list-disc pl-6">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </section>
      <p>
        {{ t('questions') }}
        <VioLink :to="localePath('/contact')">{{ t('contact') }}</VioLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// data
const sections = [
  {
    heading: t('bring'),
    items: [t('bringController'), t('bringMedia'), t('bringHeadphones')],
  },
  {
    heading: t('audio'),
    items: [t('audioMaster'), t('audioMonitor'), t('audioCables')],
  },
  {
    heading: t('booth'),
    items: [
      t('boothTable'),
      t('boothPower'),
      t('boothBattery'),
      t('boothWeather'),
    ],
  },
  {
    heading: t('setup'),
    items: [t('setupPlay'), t('setupSoundcheck')],
  },
  {
    heading: t('optional'),
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
  audioMonitor: Mindestens ein Monitor am DJ Pult, angeschlossen an den Booth Ausgang (2× 6,35 mm Klinke, symmetrisch).
  booth: DJ Pult
  boothBattery: Als Rückfall ist Akkubetrieb möglich, für Sets bis zu 2 Stunden problemlos.
  boothPower: Eine geerdete 230 V Steckdose, der Controller braucht höchstens 30 W.
  boothTable: Ein stabiler, ebener Tisch mit mindestens 50 × 35 cm Fläche.
  boothWeather: Draußen eine Überdachung für das DJ Pult.
  bring: Das bringe ich mit
  bringController: Denon DJ Prime GO+ (standalone, kein Laptop nötig)
  bringHeadphones: Kopfhörer
  bringMedia: Musik auf USB Sticks
  contact: Schreib mir!
  description: Technische Anforderungen für Auftritte von DJ cReal.
  intro: Hier steht, was ich zum Auflegen brauche. Falls etwas davon nicht möglich ist, melde dich gerne vor dem Termin, dann finden wir eine Lösung.
  optional: Auf Wunsch
  optionalMicrophone: Mikrofon für Ansagen, anschließbar über XLR oder 6,35 mm Klinke.
  optionalStreaming: Musikstreaming, falls WLAN verfügbar ist.
  questions: Noch Fragen?
  setup: Aufbau
  setupPlay: Einstecken und loslegen ist möglich, auch ohne Stromanschluss.
  setupSoundcheck: Ein Soundcheck vor der Veranstaltung ist mir lieber.
  title: Technischer Rider
en:
  audio: Audio
  audioCables: All cables to the PA and monitor are provided by the venue.
  audioMaster: Connection to the PA via 2× XLR (balanced, preferred) or 2× RCA (unbalanced).
  audioMonitor: At least one booth monitor, connected to the booth output (2× 6.35 mm jack, balanced).
  booth: Booth
  boothBattery: Battery operation works as a fallback, reliably for sets of up to 2 hours.
  boothPower: One grounded 230 V socket, the controller draws 30 W at most.
  boothTable: A stable, level table with at least 50 × 35 cm of space.
  boothWeather: Outdoors, a roof or cover over the booth.
  bring: What I bring
  bringController: Denon DJ Prime GO+ (standalone, no laptop needed)
  bringHeadphones: Headphones
  bringMedia: Music on USB sticks
  contact: Get in touch!
  description: Technical requirements for performances by DJ cReal.
  intro: This rider lists what I need to play. If something can't be provided, just get in touch before the gig and we'll find a solution.
  optional: On request
  optionalMicrophone: Microphone for announcements, connected via XLR or 6.35 mm jack.
  optionalStreaming: Music streaming, if Wi-Fi is available.
  questions: Any questions?
  setup: Setup
  setupPlay: Plug and play is possible, even without a power connection.
  setupSoundcheck: A soundcheck before the event is preferred.
  title: Technical rider
</i18n>
