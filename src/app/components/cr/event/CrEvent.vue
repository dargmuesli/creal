<template>
  <div
    class="flex flex-col max-lg:border-l-2 max-lg:border-dashed max-lg:border-gray-700 max-lg:pl-4 lg:flex-row lg:items-stretch"
  >
    <div class="shrink-0 basis-1/3">
      <img
        v-if="crealEvent.image"
        :alt="t('imageAlt')"
        class="mt-4 max-h-64 w-full rounded-t-lg object-cover lg:mb-4 lg:max-h-none lg:rounded-l-lg lg:rounded-r-none"
        :src="imageSrc"
      />
    </div>
    <div
      class="flex min-w-0 flex-1 gap-2 lg:border-l-2 lg:border-dashed lg:border-gray-700"
    >
      <div
        class="mb-4 flex min-w-0 flex-1 flex-col justify-center p-4 lg:mt-4 lg:p-8"
        :class="[
          crealEvent.image
            ? 'rounded-b-lg bg-gray-900 lg:rounded-l-none lg:rounded-r-lg'
            : '',
        ]"
      >
        <i18n-t keypath="datetime" tag="span">
          <template #start>
            <VioTime :datetime="crealEvent.dateStart" />
          </template>
          <template v-if="crealEvent.dateEnd" #end>
            <i18n-t keypath="datetimeEnd" tag="span">
              <template #end>
                <VioTime :datetime="crealEvent.dateEnd" />
              </template>
            </i18n-t>
          </template>
          <template v-if="crealEvent.location" #location>
            {{ t('datetimeLocation', { location: crealEvent.location }) }}
          </template>
        </i18n-t>
        <div class="relative flex items-center">
          <CrLivePulse
            v-if="
              index === 0 &&
              (crealEvent.dateEnd
                ? now < new Date(crealEvent.dateEnd)
                : now < new Date(crealEvent.dateStart))
            "
            class="absolute -left-9.75"
          />
          <div
            v-else
            class="absolute -left-9.75 size-3 rounded-full bg-gray-700"
            :class="[...(crealEvent.image ? ['lg:hidden'] : [])]"
          />
          <span
            class="overflow-hidden text-4xl leading-snug font-bold text-ellipsis text-white lg:text-5xl"
          >
            {{ crealEvent.title }}
          </span>
        </div>
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
            :icon="false"
            :is-colored="false"
            :to="crealEvent.url"
          >
            {{ t('details') }}
          </VioLink>
        </div>
        <template v-if="gigs.length">
          <hr class="my-4 border-gray-700" />
          <ul class="flex flex-col gap-3">
            <li
              v-for="gig in gigs"
              :key="gig.documentId"
              class="rounded-lg bg-gray-800 p-3"
            >
              <i18n-t keypath="datetime" tag="span">
                <template #start>
                  <VioTime :datetime="gig.dateStart" />
                </template>
                <template v-if="gig.dateEnd" #end>
                  <i18n-t keypath="datetimeEnd" tag="span">
                    <template #end>
                      <VioTime :datetime="gig.dateEnd" />
                    </template>
                  </i18n-t>
                </template>
                <template v-if="gig.location" #location>
                  {{ t('datetimeLocation', { location: gig.location }) }}
                </template>
              </i18n-t>
              <div class="text-lg font-bold text-white">
                {{ gig.title }}
              </div>
              <!-- eslint-disable vue/no-v-html -->
              <div
                v-if="gig.description"
                class="*:overflow-hidden *:text-ellipsis"
                v-html="marked(gig.description)"
              />
              <!-- eslint-enable vue/no-v-html -->
              <VioLink
                v-if="gig.url && gig.url !== ''"
                :aria-label="t('details')"
                :icon="false"
                :is-colored="false"
                :to="gig.url"
              >
                {{ t('details') }}
              </VioLink>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CollectionItem } from '@dargmuesli/nuxt-vio/shared/types/fetch'
import { marked } from 'marked'

export interface Image {
  url: URL
}

const {
  crealEvent,
  gigs = [],
  index,
} = defineProps<{
  crealEvent: CrealGig
  gigs?: CollectionItem<CrealGig>[]
  index: number
}>()

const { t } = useI18n()
const getServiceHref = useGetServiceHref()
const now = useNow()

// computations
const imageSrc = computed(
  () =>
    getServiceHref({ allowInternal: false, name: 'creal-strapi' }) +
    crealEvent.image?.url,
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
