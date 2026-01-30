<template>
  <!-- <VioButton
    :aria-label="t('bookCreal')"
    class="basis-0"
    :is-colored="false"
    :to="`mailto:e-mail+creal@jonas-thelemann.de?subject=${encodeURIComponent(
      t('bookingSubject'),
    )}`"
  > -->
  <VioLink
    :aria-label="t('bookCreal')"
    class="flex gap-2"
    :is-colored="false"
    :to="localePath('/contact')"
  >
    <span class="basis-0 whitespace-nowrap">{{ t('bookCreal') }}</span>
    <span aria-hidden="true">{{ t('arrow') }}</span>
  </VioLink>
</template>
<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<i18n lang="yaml">
de:
  arrow: →
  bookCreal: cReal buchen
  # bookingSubject: Buchungsanfrage
en:
  arrow: →
  bookCreal: Book cReal
  # bookingSubject: Booking Request
</i18n>
