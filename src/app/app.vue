<template>
  <div :data-is-loading="isLoading" data-testid="is-loading">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!-- `NuxtLayout` can't have mulitple child nodes (https://github.com/nuxt/nuxt/issues/21759) -->
      <NuxtPage />
    </NuxtLayout>
    <CrPlayerPlyr />
    <CookieControl :locale />
    <VioSonner />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const siteConfig = useSiteConfig()
const timeZone = useTimeZone()

const { loadingIds, indicateLoadingDone } = useLoadingDoneIndicator('app')

// methods
const initialize = () => {
  if (import.meta.client) {
    saveTimeZoneAsCookie()
  }
}
const saveTimeZoneAsCookie = () =>
  (useCookie(TIMEZONE_COOKIE_NAME, {
    // default: () => undefined, // setting `default` on the client side only does not write the cookie
    httpOnly: false,
    sameSite: 'strict',
    secure: true,
  }).value = timeZone)

// computations
const isLoading = computed(() => !!loadingIds.value.length)

// lifecycle
onMounted(() => indicateLoadingDone())

// initialization
useAppLayout()
usePolyfills()
useSchemaOrg([
  defineWebSite({
    description: siteConfig.description,
  }),
])
useVioGtag()
initialize()
</script>
