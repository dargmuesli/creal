<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>FAQ</h1>
      <Error v-if="requestError !== null" :error="requestError">
        {{ requestError.message }}
      </Error>
      <ul v-if="items !== null" class="list-none">
        <li
          v-for="item in items"
          :key="item.id"
          class="border-b duration-300"
          :class="{
            'my-4': itemFocused === item,
            'mx-8': itemFocused !== item,
          }"
        >
          <Faq :faq="item" :toggle-function="toggleItemFocused" />
        </li>
      </ul>
      <PagingControls
        v-if="
          (partString !== null &&
          queryPrevious !== null &&
          queryNext !== null &&
          allowPrevious !== null &&
          allowNext !== null &&
          (allowPrevious || allowNext))"
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
import Error from '~/components/Error.vue'
import Faq from '~/components/Faq.vue'
import PagingControls from '~/components/PagingControls.vue'

@Component({
  components: {
    Button,
    Error,
    Faq,
    PagingControls,
  },
})
export default class extends Paging {
  itemFocused: any = null

  toggleItemFocused(item: any) {
    if (this.itemFocused === null) {
      this.itemFocused = item
      this.$set(item, 'focused', true)
    } else {
      this.$set(this.itemFocused, 'focused', false)

      if (this.itemFocused === item) {
        this.itemFocused = null
      } else {
        this.itemFocused = item
        this.$set(item, 'focused', true)
      }
    }
  }

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
      return {
        requestError: e,
      }
    }

    return $paging(items, itemsCountTotal, query, start, limit)
  }
}
</script>
