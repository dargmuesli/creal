<template>
  <div>
    <slot />
    <PagingControls
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

interface Props {
  isPreviousAllowed?: boolean
  isNextAllowed?: boolean
  partString: string
  queryPrevious: LocationQuery
  queryNext: LocationQuery
}
const props = withDefaults(defineProps<Props>(), {
  isPreviousAllowed: true,
  isNextAllowed: true,
})

const route = useRoute()

// methods
const init = () => {
  if (props.queryPrevious === undefined || props.queryNext === undefined)
    return {}

  const queryPreviousSearchParamsString = '?' + props.queryPrevious.toString()

  useHead({
    link: [
      // // Overrides nuxtseo's canonical link, breaking Google's SEO
      // {
      //   href: route.path,
      //   rel: 'canonical',
      // },
      ...(props.isPreviousAllowed
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
      ...(props.isNextAllowed
        ? [
            {
              href:
                route.path +
                '?' +
                (props.queryNext as Record<string, string>).toString(),
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
