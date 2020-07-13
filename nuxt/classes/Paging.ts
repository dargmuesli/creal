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
  requestError: Error | null = null
  items: Array<any> | null = null
  partString: String | null = null
  queryNext: Record<string, string> | null = null
  queryPrevious: Record<string, string> | null = null
  allowNext: boolean | null = null
  allowPrevious: boolean | null = null

  watchQuery() {
    return ['limit', 'start']
  }

  head() {
    if (this.queryPrevious === null || this.queryNext === null) {
      return
    }

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
