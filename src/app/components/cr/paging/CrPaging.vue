<template>
  <div>
    <slot />
    <CrPagingControls
      v-if="isPreviousAllowed || isNextAllowed"
      :is-previous-allowed="isPreviousAllowed"
      :is-next-allowed="isNextAllowed"
      :part-string="partString"
      :query-previous="queryPrevious"
      :query-next="queryNext"
    />
  </div>
</template>

<script setup lang="ts">
import type { LocationQuery } from '#vue-router'

const {
  isPreviousAllowed = true,
  isNextAllowed = true,
  partString,
  queryPrevious,
  queryNext,
} = defineProps<{
  isPreviousAllowed?: boolean
  isNextAllowed?: boolean
  partString: string
  queryPrevious: LocationQuery
  queryNext: LocationQuery
}>()

const route = useRoute()

// methods
const init = () => {
  if (queryPrevious === undefined || queryNext === undefined) return {}

  const queryPreviousSearchParamsString = '?' + queryPrevious.toString()

  useHead({
    link: [
      // // Overrides nuxtseo's canonical link, breaking Google's SEO
      // {
      //   href: route.path,
      //   rel: 'canonical',
      // },
      ...(isPreviousAllowed
        ? [
            {
              href:
                queryPreviousSearchParamsString === '?'
                  ? route.path
                  : route.path + queryPreviousSearchParamsString,
              rel: 'prev',
            },
          ]
        : []),
      ...(isNextAllowed
        ? [
            {
              href:
                route.path +
                '?' +
                (queryNext as Record<string, string>).toString(),
              rel: 'next',
            },
          ]
        : []),
    ],
  })
}

// initialization
init()
</script>

<script lang="ts">
export default {
  name: 'CrealPaging',
}
</script>
