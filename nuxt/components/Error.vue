<template>
  <h1>{{ statusCode ? `${statusCode} - ` : '' }}{{ statusReason }}</h1>
</template>

<script lang="ts">
import status from '@http-util/status-i18n'
import { defineComponent, PropType } from '#app'

export default defineComponent({
  name: 'CrealError',
  props: {
    statusCode: {
      default: undefined,
      type: Number as PropType<number | undefined>,
    },
  },
  computed: {
    statusReason(): string {
      return (
        status(this.statusCode, this.$i18n.locale) ||
        (this.$t('error') as string)
      )
    },
  },
})
</script>

<i18n lang="yml">
de:
  error: Fehler
en:
  error: Error
</i18n>
