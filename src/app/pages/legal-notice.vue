<template>
  <VioPageLegalNotice />
</template>

<script setup lang="ts">
const { t } = useI18n()
const title = t('title')
useCrealHeadDefault({ title })
</script>

<i18n lang="yaml">
de:
  title: Impressum
en:
  title: Legal notice
</i18n>
