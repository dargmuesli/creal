<template>
  <div class="container mx-auto mb-4">
    <section>
      <h1>{{ title }}</h1>
      <Error v-if="requestError !== null" :error="requestError">
        {{ requestError.message }}
      </Error>
      <div v-if="items !== null && items.length > 0">
        <ul class="list-none">
          <li
            v-for="item in items"
            :key="slugify(item.title)"
            class="border duration-300"
            :class="{
              'my-4': itemFocused === item,
              'mx-8 -my-px': itemFocused !== item,
            }"
          >
            <Faq :faq="item" :toggle-function="toggleItemFocused" />
          </li>
        </ul>
        <PagingControls
          v-if="
            partString !== null &&
            queryPrevious !== null &&
            queryNext !== null &&
            allowPrevious !== null &&
            allowNext !== null &&
            (allowPrevious || allowNext)
          "
          :part-string="partString"
          :query-previous="queryPrevious"
          :query-next="queryNext"
          :allow-previous="allowPrevious"
          :allow-next="allowNext"
        />
      </div>
      <div v-else class="text-center">No FAQ found.</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import slugify from 'slugify'

import Paging from '~/classes/Paging.ts'

@Component({
  head(this: FaqPage): Object {
    return {
      title: this.title,
    }
  },
})
export default class FaqPage extends Paging {
  title: String = 'FAQ'

  itemFocused: any = null

  slugify(input: string) {
    return slugify(input)
  }

  toggleItemFocused(item: any) {
    if (this.itemFocused === null) {
      this.focusItem(item)
    } else {
      this.$set(this.itemFocused, 'focused', false)

      if (this.itemFocused === item) {
        this.itemFocused = null
        history.replaceState(
          '',
          document.title,
          window.location.pathname + window.location.search
        )
      } else {
        this.focusItem(item)
      }
    }
  }

  focusItem(item: any) {
    this.$set(item, 'focused', true)
    this.itemFocused = item
    history.replaceState(undefined, '', `#${slugify(item.title)}`)
  }

  mounted() {
    if (this.items === null) {
      return
    }

    for (const item of this.items) {
      if (slugify(item.title) === window.location.hash.substring(1)) {
        this.$set(item, 'focused', true)
        this.itemFocused = item
        break
      }
    }
  }

  async asyncData({
    $axios,
    $paging,
    query,
  }: {
    $axios: any
    $paging: Function
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

    let itemFocused

    if (process.client) {
      for (const item of items) {
        if (slugify(item.title) === window.location.hash.substring(1)) {
          item.focused = true
          itemFocused = item
          break
        }
      }
    }

    if (itemFocused === undefined) {
      itemFocused = null
    }

    return {
      itemFocused,
      ...$paging(items, itemsCountTotal, query, start, limit),
    }
  }
}
</script>
