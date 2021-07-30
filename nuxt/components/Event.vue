<template>
  <div
    class="flex flex-wrap items-center justify-center space-y-4 lg:space-y-0"
  >
    <div class="lg:pr-2 space-y-2 lg:w-1/2">
      <div>{{ datetime }}</div>
      <h2 class="m-0">{{ event.title }}</h2>
      <div v-if="event.description !== null">
        {{ event.description }}
      </div>
    </div>
    <div class="lg:pl-2 space-y-4 lg:w-1/2">
      <img
        v-if="event.image !== null"
        alt="Event image."
        :src="'https://' + strapiDomain + event.image.url"
      />
      <div v-if="event.url !== null && event.url !== ''" class="text-center">
        <Button :icon="false" :link="event.url">Details</Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

interface Event {
  dateEnd: any
  dateStart: any
}

@Component({})
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
    return `strapi.${process.env.NUXT_ENV_STACK_DOMAIN}`
  }
}
</script>
