<template>
  <div>
    <slot />
    <CrPagingControls
      v-if="isPreviousAllowed || isNextAllowed"
      :is-next-allowed="isNextAllowed"
      :is-previous-allowed="isPreviousAllowed"
      :part-string="partString"
      :query-next="queryNext"
      :query-previous="queryPrevious"
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
              rel: 'prev' as const,
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
              rel: 'next' as const,
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
