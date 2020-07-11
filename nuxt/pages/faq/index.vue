<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>FAQ</h1>
      <ul class="list-none">
        <li
          v-for="item in items"
          :key="item.id"
          class="border my-4 p-4 rounded first:mt-0 last:mb-0"
        >
          <Faq :faq="item" />
        </li>
      </ul>
      <PagingControls
        :part-string="partString"
        :query-previous="queryPrevious"
        :query-next="queryNext"
        :allow-previous="allowPrevious"
        :allow-next="allowNext"
      />
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'

import Paging from '~/classes/Paging.ts'

import Button from '~/components/Button.vue'
import Faq from '~/components/Faq.vue'
import PagingControls from '~/components/PagingControls.vue'

@Component({
  components: {
    Button,
    Faq,
    PagingControls,
  },
})
export default class extends Paging {
  async asyncData({
    $axios,
    $paging,
    query,
  }: {
    $axios: any
    $paging: any
    query: any
  }) {
    const limit = +(query.limit ? query.limit : 100)
    const start = +(query.start ? query.start : 0)

    let itemsCountTotal, items

    try {
      itemsCountTotal = await $axios.$get('/strapi/faqs/count')
      items = await $axios.$get('/strapi/faqs', {
        params: new URLSearchParams({
          _sort: 'title:DESC',
          _limit: String(limit),
          _start: String(start),
        }),
      })
    } catch (e) {
      return
    }

    return $paging(items, itemsCountTotal, query, start, limit)
  }
}
</script>
