import { Component, Vue } from 'nuxt-property-decorator'

import Button from '~/components/Button.vue'
import Event from '~/components/Event.vue'

@Component({
  components: {
    Button,
    Event,
  },
})
export default class extends Vue {
  queryNext?: Record<string, string>
  queryPrevious?: Record<string, string>
  allowNext?: boolean
  allowPrevious?: boolean

  watchQuery() {
    return ['limit', 'start']
  }

  head() {
    const queryPreviousSearchParamsString =
      '?' + new URLSearchParams(this.queryPrevious).toString()
    return {
      link: [
        {
          href: this.$route.path,
          rel: 'canonical',
        },
        ...(this.allowPrevious
          ? [
              {
                href:
                  queryPreviousSearchParamsString === '?'
                    ? this.$route.path
                    : this.$route.path + queryPreviousSearchParamsString,
                rel: 'prev',
              },
            ]
          : []),
        ...(this.allowNext
          ? [
              {
                href:
                  this.$route.path +
                  '?' +
                  new URLSearchParams(this.queryNext).toString(),
                rel: 'next',
              },
            ]
          : []),
      ],
    }
  }
}
