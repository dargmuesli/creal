<template>
  <div
    class="
      flex flex-col
      lg:flex-row
      items-center
      justify-center
      lg:space-x-4
      space-y-4
      lg:space-y-0
    "
  >
    <div class="space-y-2 lg:w-1/2">
      <div>{{ datetime }}</div>
      <h2 class="m-0">{{ event.title }}</h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="event.description" v-html="$marked(event.description)" />
    </div>
    <div class="space-y-4 lg:w-1/2">
      <img v-if="event.image" alt="Event image." :src="strapiDomain" />
      <div v-if="event.url && event.url !== ''" class="text-center">
        <Button :aria-label="$t('details')" :icon="false" :link="event.url">
          {{ $t('details') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'

interface Image {
  url: URL
}

interface Event {
  dateEnd: Date
  dateStart: Date
  image: Image
}

export default defineComponent({
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
      return `https://strapi.${process.env.NUXT_ENV_STACK_DOMAIN}${this.event.image.url}`
    },
  },
})
</script>

<i18n lang="yml">
de:
  details: Details
en:
  details: Details
</i18n>
