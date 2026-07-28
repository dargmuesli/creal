<template>
  <div>
    <slot />
    <CrPagingControls
      v-if="isPreviousAllowed || isNextAllowed"
      :is-next-allowed="isNextAllowed"
      :is-previous-allowed="isPreviousAllowed"
      :part-string="partString"
    />
  </div>
</template>

<script setup lang="ts">
const {
  isPreviousAllowed = true,
  isNextAllowed = true,
  page,
  partString,
} = defineProps<{
  isPreviousAllowed?: boolean
  isNextAllowed?: boolean
  page: number
  partString: string
}>()

const route = useRoute()
const router = useRouter()

// methods
// page 1 is the default and is kept out of the URL for a clean canonical link
const resolvePageHref = (targetPage: number) => {
  const { page: _currentPage, ...queryRest } = route.query

  return router.resolve({
    path: route.path,
    query:
      targetPage > 1 ? { ...queryRest, page: String(targetPage) } : queryRest,
  }).href
}

// initialization
useHead({
  link: [
    // // Overrides nuxtseo's canonical link, breaking Google's SEO
    // {
    //   href: route.path,
    //   rel: 'canonical',
    // },
    ...(isPreviousAllowed
      ? [{ href: resolvePageHref(page - 1), rel: 'prev' as const }]
      : []),
    ...(isNextAllowed
      ? [{ href: resolvePageHref(page + 1), rel: 'next' as const }]
      : []),
  ],
})
</script>

<script lang="ts">
export default {
  name: 'CrealPaging',
}
</script>
