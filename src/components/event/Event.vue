<template>
  <li
    class="flex flex-col justify-center gap-4 rounded-lg bg-gray-900 p-4 lg:flex-row lg:items-center lg:p-8"
  >
    <div class="vio-prose-fullwidth flex flex-col gap-2 lg:w-1/2">
      <i18n-t keypath="datetime" tag="span">
        <template #start>
          {{ dateFormat(new Date(crealEvent.dateStart)) }}
        </template>
        <template v-if="crealEvent.dateEnd" #end>
          {{
            t('datetimeEnd', {
              end: dateFormat(new Date(crealEvent.dateEnd)),
            })
          }}
        </template>
        <template v-if="crealEvent.location" #location>
          {{ t('datetimeLocation', { location: crealEvent.location }) }}
        </template>
      </i18n-t>
      <span class="block text-2xl font-bold text-white lg:text-4xl">
        {{ crealEvent.title }}
      </span>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="crealEvent.description"
        v-html="marked(crealEvent.description)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div class="flex flex-col gap-4 lg:w-1/2">
      <img
        v-if="crealEvent.image.data"
        class="m-auto"
        alt="Event image."
        :src="imageSrc"
      />
      <div v-if="crealEvent.url && crealEvent.url !== ''" class="text-center">
        <VioButtonColored
          :aria-label="t('details')"
          class="vio-prose-fullwidth prose-a:text-gray-800"
          :icon="false"
          :to="crealEvent.url"
        >
          {{ t('details') }}
        </VioButtonColored>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { marked } from 'marked'

import type { CrealEvent } from '~/types/creal'

export interface Image {
  url: URL
}

interface Props {
  crealEvent: CrealEvent
}
const props = withDefaults(defineProps<Props>(), {})

const { t } = useI18n()
const dateTime = useDateTime()
const getServiceHref = useGetServiceHref()

// computations
const dateFormat = (date: Date) => dateTime(date).format('lll')
const imageSrc = computed(
  () =>
    getServiceHref({ isSsr: false, name: 'creal-strapi', port: 1337 }) +
    props.crealEvent.image.data.attributes.url,
)
</script>

<script lang="ts">
export default {
  name: 'CrealEvent',
}
</script>

<i18n lang="yaml">
de:
  datetime: '{start}{end}{location}'
  datetimeEnd: ' - {end}'
  datetimeLocation: ' ⋅ {location}'
  details: Details
en:
  datetime: '{start}{end}{location}'
  datetimeEnd: ' - {end}'
  datetimeLocation: ' ⋅ {location}'
  details: Details
</i18n>
