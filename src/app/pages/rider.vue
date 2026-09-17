<template>
  <div class="flex-1">
    <VioLayoutBreadcrumbs>
      {{ title }}
    </VioLayoutBreadcrumbs>
    <div class="flex flex-col gap-16">
      <CrRiderCard
        :heading="t('bring')"
        :icon="BriefcaseIcon"
        is-wide
        :items="[
          t('bringController'),
          t('bringMedia'),
          t('bringHeadphones'),
          t('bringHotspot'),
          t('bringMicrophone'),
        ]"
      />
      <section class="flex flex-col gap-4 lg:gap-8">
        <h2>{{ t('venue') }}</h2>
        <div class="grid gap-4 lg:grid-cols-2 lg:gap-8">
          <CrRiderCard
            :heading="t('audio')"
            heading-tag="h3"
            :icon="SpeakerWaveIcon"
            :items="[t('audioMaster'), t('audioMonitor'), t('audioCables')]"
          />
          <CrRiderCard
            :heading="t('booth')"
            heading-tag="h3"
            :icon="BoltIcon"
            :items="[
              t('boothTable'),
              t('boothPower'),
              t('boothPowerStreaming'),
              t('boothWeather'),
            ]"
          />
        </div>
      </section>
      <CrRiderCard
        :heading="t('info')"
        :icon="InformationCircleIcon"
        is-wide
        :items="[
          t('infoPlay'),
          t('infoBattery'),
          t('infoSoundcheck'),
          t('infoMicrophone'),
          t('infoStreaming'),
        ]"
      />
      <CrBookingCta :text="t('ctaText')" :title="t('ctaTitle')" />
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
  audioCables: Alle Kabel zur Anlage und zum Monitor.
  audioMaster: Anschluss an die Anlage über 2× XLR (symmetrisch, bevorzugt) oder 2× Cinch (unsymmetrisch).
  audioMonitor: "Mindestens ein Monitor am DJ Pult, angeschlossen an meinen Booth Ausgang (2× 6,35\u00A0mm Klinke, symmetrisch)."
  booth: DJ Pult
  boothPower: "Eine geerdete 230\u00A0V Steckdose, der Controller braucht höchstens 30\u00A0W."
  boothPowerStreaming: Beim Streaming eine zweite Steckdose zum Laden des Hotspots.
  boothTable: "Ein stabiler, ebener Tisch in Stehhöhe mit mindestens 50\u00A0×\u00A035\u00A0cm Fläche."
  boothWeather: Draußen eine Überdachung für das DJ Pult.
  bring: Das bringe ich mit
  bringController: Denon DJ Prime GO+ (standalone, kein Laptop nötig)
  bringHeadphones: Kopfhörer
  bringHotspot: Hotspot für Musikstreaming, auf Wunsch
  bringMedia: Musik auf USB Sticks
  bringMicrophone: Mikrofon für Ansagen, auf Wunsch
  ctaText: Melde dich vor dem Termin, dann finden wir eine Lösung.
  ctaTitle: Fehlt etwas?
  description: Technische Anforderungen für Auftritte von DJ cReal.
  info: Gut zu wissen
  infoBattery: "Ohne Strom läuft der Controller per Akku, für Sets bis zu 2\u00A0Stunden problemlos."
  infoMicrophone: "Ein Mikrofon der Location geht auch, anschließbar über XLR oder 6,35\u00A0mm Klinke."
  infoPlay: Einstecken und loslegen ist möglich.
  infoSoundcheck: Ein Soundcheck vor der Veranstaltung ist mir lieber.
  infoStreaming: Musikstreaming ist auf Wunsch möglich, über das WLAN der Location oder bei gutem Mobilfunkempfang über meinen Hotspot.
  title: Technischer Rider
  venue: Das stellt die Location
en:
  audio: Audio
  audioCables: All cables to the PA and monitor.
  audioMaster: Connection to the PA via 2× XLR (balanced, preferred) or 2× RCA (unbalanced).
  audioMonitor: "At least one booth monitor, connected to my booth output (2× 6.35\u00A0mm jack, balanced)."
  booth: Booth
  boothPower: "One grounded 230\u00A0V socket, the controller draws 30\u00A0W at most."
  boothPowerStreaming: When streaming, a second socket to charge the hotspot.
  boothTable: "A stable, level table at standing height with at least 50\u00A0×\u00A035\u00A0cm of space."
  boothWeather: Outdoors, a roof or cover over the booth.
  bring: What I bring
  bringController: Denon DJ Prime GO+ (standalone, no laptop needed)
  bringHeadphones: Headphones
  bringHotspot: Hotspot for music streaming, on request
  bringMedia: Music on USB sticks
  bringMicrophone: Microphone for announcements, on request
  ctaText: Get in touch before the gig and we'll find a solution.
  ctaTitle: Something missing?
  description: Technical requirements for performances by DJ cReal.
  info: Good to know
  infoBattery: "Without power, the controller runs on battery, reliably for sets of up to 2\u00A0hours."
  infoMicrophone: "A venue microphone works too, connected via XLR or 6.35\u00A0mm jack."
  infoPlay: Plug and play is possible.
  infoSoundcheck: A soundcheck before the event is preferred.
  infoStreaming: Music streaming is possible on request, via the venue's Wi-Fi or, with good mobile reception, via my hotspot.
  title: Technical rider
  venue: What the venue provides
</i18n>
