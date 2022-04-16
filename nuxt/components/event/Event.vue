<template>
  <div
    class="flex flex-col justify-center space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0"
  >
    <div class="creal-prose-fullwidth space-y-2 lg:w-1/2">
      <div class="flex gap-2">
        <div>{{ datetime }}</div>
        <div v-if="event.location" class="flex gap-2">
          <div>{{ $t('separator') }}</div>
          <div>{{ event.location }}</div>
        </div>
      </div>
      <h2 class="m-0">{{ event.title }}</h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="event.description" v-html="$marked(event.description)" />
    </div>
    <div class="space-y-4 lg:w-1/2">
      <img
        v-if="event.image.data"
        class="m-auto"
        alt="Event image."
        :src="strapiDomain"
      />
      <div v-if="event.url && event.url !== ''" class="text-center">
        <Button
          :aria-label="$t('details')"
          class="creal-prose-fullwidth prose-a:text-gray-800"
          :icon="false"
          :to="event.url"
        >
          {{ $t('details') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '#app'
import { CollectionItem } from '~/plugins/paging'

interface Image {
  url: URL
}

export interface Event {
  dateEnd: Date
  dateStart: Date
  image: { data: CollectionItem<Image> }
}

export default defineComponent({
  name: 'CrealEvent',
  props: {
    event: {
      required: true,
      type: Object as PropType<Event>,
    },
  },
  computed: {
    datetime(): any {
      if (!this.event) return

      const moment = this.$moment(this.event.dateStart)

      if (this.event.dateEnd) {
        return moment.twix(this.event.dateEnd).format({
          implicitMinutes: false,
          implicitYear: false,
          showDayOfWeek: true,
        })
      }

      return moment.format('ddd D MMM YYYY, h:mm')
    },
    strapiDomain(): string {
      return `https://strapi.${process.env.NUXT_ENV_STACK_DOMAIN}${this.event.image.data.attributes.url}`
    },
  },
})
</script>

<i18n lang="yml">
de:
  details: Details
  separator: ⋅
en:
  details: Details
  separator: ⋅
</i18n>
