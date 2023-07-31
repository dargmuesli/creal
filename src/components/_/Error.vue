<template>
  <h1>{{ statusCode ? `${statusCode} - ` : '' }}{{ statusReason }}</h1>
</template>

<script setup lang="ts">
import { status } from '@http-util/status-i18n'

export interface Props {
  statusCode?: number
}
const props = withDefaults(defineProps<Props>(), {
  statusCode: undefined,
})

const { locale, t } = useI18n()

// computations
const statusReason = computed(() => {
  return status(props.statusCode, locale.value) || t('error')
})
</script>

<script lang="ts">
export default {
  name: 'CrealError',
}
</script>

<i18n lang="yaml">
de:
  error: Fehler
en:
  error: Error
</i18n>
