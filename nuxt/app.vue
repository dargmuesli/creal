<template>
  <div :data-is-loading="isLoading">
    <!-- <SchemaOrgDebug /> -->
    <NuxtLayout>
      <NuxtLoadingIndicator color="#fff" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const cookieControl = useCookieControl()

const loadingId = Math.random()
const loadingIds = useState('loadingIds', () => [loadingId])

// data
const name = 'cReal'

// computations
const isLoading = computed(() => !!loadingIds.value.length)

// lifecycle
onMounted(() => loadingIds.value.splice(loadingIds.value.indexOf(loadingId), 1))
watch(
  () => cookieControl.cookiesEnabledIds.value,
  (current, previous) => {
    if (
      (!previous?.includes('ga') && current?.includes('ga')) ||
      (previous?.includes('ga') && !current?.includes('ga'))
    ) {
      window.location.reload()
    }
  },
  { deep: true }
)

// initialization
useSchemaOrg([
  definePerson({
    name,
    logo: '/assets/static/logos/open-graph.png',
    // sameAs: ['https://twitter.com/company'],
  }),
  defineWebSite({
    description: t('globalOgSeoDescription'),
    inLanguage: locale,
    name,
  }),
  defineWebPage(),
])
</script>
