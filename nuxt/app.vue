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
const { $moment } = useNuxtApp()
const { t, locale } = useI18n()
const cookieControl = useCookieControl()

const loadingId = Math.random()
const loadingIds = useState('loadingIds', () => [loadingId])

// data
const name = 'cReal'

// methods
const init = () => {
  if (process.client) {
    const cookieTimezone = useCookie(TIMEZONE_COOKIE_NAME, {
      // default: () => undefined, // setting `default` on the client side only does not write the cookie
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
    })
    // @ts-ignore `tz` should be part of `$moment` (https://github.com/iamkun/dayjs/issues/2106)
    cookieTimezone.value = $moment.tz.guess()
  }
}

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
init()
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
