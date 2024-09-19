<template>
  <div class="flex flex-col rounded-lg bg-gray-900 lg:flex-row lg:items-center">
    <div class="shrink-0 basis-1/3 self-stretch">
      <img
        v-if="crealEvent.image"
        :alt="t('imageAlt')"
        class="h-full max-h-64 w-full rounded-t-lg object-cover lg:max-h-none lg:rounded-l-lg lg:rounded-r-none"
        :src="imageSrc"
      />
    </div>
    <div class="flex min-w-0 flex-col gap-2 p-4 lg:p-8">
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
      <span
        class="overflow-hidden text-ellipsis text-4xl font-bold leading-snug text-white lg:text-5xl"
      >
        {{ crealEvent.title }}
      </span>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="crealEvent.description"
        class="*:overflow-hidden *:text-ellipsis"
        v-html="marked(crealEvent.description)"
      />
      <!-- eslint-enable vue/no-v-html -->
      <div class="prose-a:text-yellow-500">
        <VioLink
          v-if="crealEvent.url && crealEvent.url !== ''"
          :aria-label="t('details')"
          :is-colored="false"
          :icon="false"
          :to="crealEvent.url"
        >
          {{ t('details') }}
        </VioLink>
      </div>
    </div>
  </div>
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
    props.crealEvent.image.url,
)
</script>

<script lang="ts">
export default {
  name: 'CrealEvent',
}
</script>

<i18n lang="yaml">
de:
  datetime: '{location}{start}{end}'
  datetimeEnd: ' - {end}'
  datetimeLocation: '{location} ⋅ '
  details: Details
  imageAlt: Ein Foto von oder ein Titelbild der Veranstaltung.
en:
  datetime: '{location}{start}{end}'
  datetimeEnd: ' - {end}'
  datetimeLocation: '{location} ⋅ '
  details: Details
  imageAlt: A photo of the event or the event's title picture.
</i18n>
