<template>
  <h1>{{ statusCode ? `${statusCode} - ` : '' }}{{ statusReason }}</h1>
</template>

<script lang="ts">
import status from '@http-util/status-i18n'
import { defineComponent, PropType } from '@nuxtjs/composition-api'

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
      // TODO: https://github.com/http-util/status-i18n/issues/27
      let statusCodeLanguageCode

      switch (this.$i18n.locale) {
        case 'de': // Prepared for https://github.com/http-util/status-i18n/pull/26
          statusCodeLanguageCode = 'de-de'
          break
        // en captured by `default`
        default:
          statusCodeLanguageCode = 'en-us'
          break
      }
      return (
        status(this.statusCode, statusCodeLanguageCode) ||
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
