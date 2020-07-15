<template>
  <div class="items-center flex flex-wrap">
    <div class="lg:pr-2 lg:w-1/2">
      <div>{{ datetime }}</div>
      <h2 class="m-0">{{ event.title }}</h2>
      <div v-if="event.description !== null" class="mb-4">
        {{ event.description }}
      </div>
    </div>
    <div class="lg:pl-2 lg:w-1/2">
      <img
        v-if="event.image !== null"
        :src="'https://' + strapiDomain + event.image.url"
        class="mb-4"
      />
      <div v-if="event.url !== null" class="mt-4 text-center">
        <Button :icon="false" :link="event.url">Details</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

import Button from '~/components/Button.vue'

interface Event {
  dateEnd: any
  dateStart: any
}

@Component({
  components: {
    Button,
  },
})
export default class extends Vue {
  @Prop({ type: Object }) readonly event!: Event

  get datetime(): any {
    const moment = this.$moment(this.event.dateStart)

    if (this.event.dateEnd) {
      return moment.twix(this.event.dateEnd).format({
        implicitMinutes: false,
        implicitYear: false,
        showDayOfWeek: true,
      })
    }

    return moment.format('ddd D MMM YYYY, h:mm')
  }

  // TODO: move to globals
  // get stackDomain(): string | undefined {
  //   return process.env.stackDomain
  // }

  get strapiDomain(): string | undefined {
    return `strapi.${process.env.stackDomain}`
  }
}
</script>
