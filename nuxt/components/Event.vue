<template>
  <div class="flex">
    <div class="w-1/2">
      <div>{{ datetime }}</div>
      <h2 class="m-0">{{ event.title }}</h2>
      <div v-if="event.description !== null" class="mb-4">
        {{ event.description }}
      </div>
      <div v-if="event.url !== null" class="text-center">
        <Button :link="event.url">Details</Button>
      </div>
    </div>
    <img
      v-if="event.image !== null"
      :src="'https://strapi.creal.' + stackDomain + event.image.url"
      class="w-1/2"
    />
  </div>
</template>

<script lang="ts">
import Button from '~/components/Button.vue'

export default {
  components: {
    Button,
  },
  props: {
    event: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    datetime() {
      const moment = this.$moment(this.event.date_start)

      if (this.event.date_end) {
        return moment.twix(this.event.date_end).format({
          implicitMinutes: false,
          implicitYear: false,
          showDayOfWeek: true,
        })
      }

      return moment.format('ddd D MMM YYYY, h:mm')
    },
    stackDomain() {
      return process.env.stackDomain
    },
  },
}
</script>
