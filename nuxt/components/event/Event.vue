<template>
  <div
    class="flex flex-col justify-center space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0"
  >
    <div class="vio-prose-fullwidth space-y-2 lg:w-1/2">
      <div class="flex gap-2">
        <i18n-t keypath="datetime">
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
      </div>
      <h2 class="m-0">{{ crealEvent.title }}</h2>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-if="crealEvent.description"
        v-html="$marked(crealEvent.description)"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div class="space-y-4 lg:w-1/2">
      <img
        v-if="crealEvent.image.data"
        class="m-auto"
        alt="Event image."
        :src="imageSrc"
      />
      <div v-if="crealEvent.url && crealEvent.url !== ''" class="text-center">
        <ButtonColored
          :aria-label="t('details')"
          class="vio-prose-fullwidth prose-a:text-gray-800"
          :icon="false"
          :to="crealEvent.url"
        >
          {{ t('details') }}
        </ButtonColored>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CrealEvent } from '~/types/creal'

export interface Image {
  url: URL
}

export interface Props {
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
    props.crealEvent.image.data.attributes.url
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
