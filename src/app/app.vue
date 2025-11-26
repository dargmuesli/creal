<template>
  <div :data-is-loading="isLoading" data-testid="is-loading">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!-- `NuxtLayout` can't have mulitple child nodes (https://github.com/nuxt/nuxt/issues/21759) -->
      <NuxtPage />
    </NuxtLayout>
    <PlayerPlyr />
    <CookieControl :locale="locale" />
    <VioSonner />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '@dargmuesli/nuxt-cookie-control/runtime/types.js'

const i18n = useI18n()
const { t } = i18n
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
const locale = computed(() => i18n.locale.value as Locale)

// lifecycle
onMounted(() => indicateLoadingDone())

// initialization
defineOgImageComponent(
  'Default',
  {
    description: siteConfig.description,
    headline: t('headline'),
    name: t('name'),
    siteConfigName: siteConfig.name,
  },
  {
    alt: t('globalSeoOgImageAlt'),
  },
)
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

<i18n lang="yaml">
de:
  headline: DJ und Event-Organisator
  name: cReal
en:
  headline: DJ and event organizer
  name: cReal
</i18n>
