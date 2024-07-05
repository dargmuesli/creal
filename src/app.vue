<template>
  <div :data-is-loading="isLoading" data-testid="is-loading">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!-- `NuxtLayout` can't have mulitple child nodes (https://github.com/nuxt/nuxt/issues/21759) -->
      <NuxtPage />
    </NuxtLayout>
    <PlayerPlyr />
    <CookieControl :locale="locale" />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '@dargmuesli/nuxt-cookie-control/runtime/types'

const { $dayjs } = useNuxtApp()
const i18n = useI18n()
const { t } = i18n
const siteConfig = useSiteConfig()

const { loadingIds, indicateLoadingDone } = useLoadingDoneIndicator('app')

// methods
const init = () => {
  $dayjs.locale(locale.value)

  if (import.meta.client) {
    const cookieTimezone = useCookie(TIMEZONE_COOKIE_NAME, {
      // default: () => undefined, // setting `default` on the client side only does not write the cookie
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
    })
    // @ts-expect-error `tz` should be part of `$dayjs` (https://github.com/iamkun/dayjs/issues/2106)
    cookieTimezone.value = $dayjs.tz.guess()
  }
}

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
  },
  {
    alt: t('globalSeoOgImageAlt'),
  },
)
useAppLayout()
useFavicons()
// usePolyfills() // hijacked ⚠️
useSchemaOrg([
  defineWebSite({
    description: siteConfig.description,
  }),
])
useVioGtag()
init()
</script>
