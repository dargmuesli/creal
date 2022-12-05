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

<script lang="ts">
export default defineComponent({
  name: 'CrealPaging',
  props: {
    isPreviousAllowed: {
      required: true,
      type: Boolean,
    },
    isNextAllowed: {
      required: true,
      type: Boolean,
    },
    partString: {
      required: true,
      type: String,
    },
    queryPrevious: {
      required: true,
      type: Object as PropType<Record<any, any>>,
    },
    queryNext: {
      required: true,
      type: Object as PropType<Record<any, any>>,
    },
  },
  head() {
    if (this.queryPrevious === undefined || this.queryNext === undefined) {
      return {}
    }

    const queryPreviousSearchParamsString =
      '?' + (this.queryPrevious as Record<string, string>).toString()
    return {
      link: [
        {
          href: this.$route.path,
          rel: 'canonical',
        },
        ...(this.isPreviousAllowed
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
        ...(this.isNextAllowed
          ? [
              {
                href:
                  this.$route.path +
                  '?' +
                  (this.queryNext as Record<string, string>).toString(),
                rel: 'next',
              },
            ]
          : []),
      ],
    }
  },
})
</script>
