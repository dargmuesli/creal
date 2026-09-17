<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <div class="flex flex-col gap-8">
      <h1>{{ title }}</h1>
      <div class="flex flex-col gap-8 lg:gap-12">
        <CrRiderCard
          :heading="t('bring')"
          :icon="BriefcaseIcon"
          is-wide
          :items="[
            t('bringController'),
            t('bringMedia'),
            t('bringHeadphones'),
            t('bringMicrophone'),
            t('bringLaptop'),
            t('bringHotspot'),
          ]"
        />
        <section class="flex flex-col gap-4 lg:gap-6">
          <h2>{{ t('venue') }}</h2>
          <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
            <CrRiderCard
              :heading="t('audio')"
              heading-tag="h3"
              :icon="SpeakerWaveIcon"
              :items="[t('audioMaster'), t('audioMonitor')]"
            />
            <CrRiderCard
              :heading="t('booth')"
              heading-tag="h3"
              :icon="BoltIcon"
              :items="[t('boothTable'), t('boothPower'), t('boothWeather')]"
            />
          </div>
        </section>
        <CrRiderCard
          :heading="t('info')"
          :icon="InformationCircleIcon"
          is-wide
          :items="[
            t('infoStreaming'),
            t('infoSoundcheck'),
            t('infoMicrophone'),
            t('infoBattery'),
          ]"
        />
        <CrBookingCta :text="t('ctaText')" :title="t('ctaTitle')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BoltIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  SpeakerWaveIcon,
} from '@heroicons/vue/24/outline'

const { t } = useI18n()

// data
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
  audioMaster: Anschluss an die Anlage über 2× XLR (symmetrisch, bevorzugt) oder 2× Cinch (unsymmetrisch).
  audioMonitor: 'Idealerweise ein oder zwei Monitorboxen (2× 6,35-mm-Klinke, symmetrisch).'
  booth: DJ-Pult
  boothPower: "Eine geerdete 230-V-Steckdose für Sets länger als 2\u00A0Stunden. Beim Streaming eine zweite zum Laden des Hotspots."
  boothTable: "Ein stabiler, ebener Tisch in Stehhöhe mit mindestens 50\u00A0×\u00A035\u00A0cm Fläche."
  boothWeather: Draußen eine Überdachung für das DJ-Pult.
  bring: Das bringe ich mit
  bringController: Standalone-Controller Denon DJ Prime GO+
  bringHeadphones: Kopfhörer
  bringHotspot: Hotspot für Musikstreaming, auf Wunsch
  bringLaptop: Laptop für Änderungen an der Musikbibliothek vor Ort, auf Wunsch
  bringMedia: Musik auf USB-Sticks
  bringMicrophone: Mikrofon, auf Wunsch
  ctaText: Melde dich jetzt, dann finden wir eine Lösung.
  ctaTitle: Fehlt etwas?
  description: 'Technischer Rider für die Buchung von DJ cReal: was ich mitbringe, vom Controller Denon DJ Prime GO+ bis zum Hotspot, und was die Location für Ton, Strom und das DJ-Pult stellt.'
  info: Gut zu wissen
  infoBattery: "Der Controller braucht höchstens 30\u00A0W und läuft ohne Stromanschluss mindestens 2\u00A0Stunden per Akku."
  infoMicrophone: Ein Mikrofon der Location geht auch, anschließbar über XLR oder 6,35-mm-Klinke.
  infoSoundcheck: Idealerweise gibt es vor der Veranstaltung einen Soundcheck.
  infoStreaming: Musikstreaming ist auf Wunsch möglich, über das WLAN der Location oder bei gutem Mobilfunkempfang über meinen Hotspot.
  title: Technischer Rider
  venue: Das stellt die Location
en:
  audio: Audio
  audioMaster: Connection to the PA via 2× XLR (balanced, preferred) or 2× RCA (unbalanced).
  audioMonitor: "Ideally one or two booth monitors (2× 6.35\u00A0mm jack, balanced)."
  booth: Booth
  boothPower: "One grounded 230\u00A0V socket for sets longer than 2\u00A0hours. When streaming, a second one to charge the hotspot."
  boothTable: "A stable, level table at standing height with at least 50\u00A0×\u00A035\u00A0cm of space."
  boothWeather: Outdoors, a roof or cover over the booth.
  bring: What I bring
  bringController: Denon DJ Prime GO+ standalone controller
  bringHeadphones: Headphones
  bringHotspot: Hotspot for music streaming, on request
  bringLaptop: Laptop for on-site changes to the music library, on request
  bringMedia: Music on USB sticks
  bringMicrophone: Microphone, on request
  ctaText: Get in touch now and we’ll find a solution.
  ctaTitle: Something missing?
  description: 'Technical rider for booking DJ cReal: what I bring, from the Denon DJ Prime GO+ controller to the hotspot, and what the venue provides for audio, power and the booth.'
  info: Good to know
  infoBattery: "The controller draws 30\u00A0W at most and runs on battery for at least 2\u00A0hours when no power is available."
  infoMicrophone: "A venue microphone works too, connected via XLR or 6.35\u00A0mm jack."
  infoSoundcheck: I prefer a soundcheck before the event.
  infoStreaming: Music streaming is possible on request, via the venue’s Wi-Fi or, with good mobile reception, via my hotspot.
  title: Technical rider
  venue: What the venue provides
</i18n>
