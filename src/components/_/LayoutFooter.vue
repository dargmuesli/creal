<template>
  <VioLayoutFooter :class="{ 'mb-20': store.playerData.isVisible }">
    <VioLayoutFooterCategory :heading="t('legal')">
      <VioLink :to="localePath('/legal-notice')">
        {{ t('legalNotice') }}
      </VioLink>
      <VioLink :to="localePath('/privacy-policy')">
        {{ t('privacyPolicy') }}
      </VioLink>
    </VioLayoutFooterCategory>
    <VioLayoutFooterCategory :heading="t('preferences')">
      <div class="grid grid-cols-2 grid-rows-2 items-center gap-2">
        <label for="vio-i18n-select">{{ t('language') }}</label>
        <select
          id="vio-i18n-select"
          class="form-input pr-8"
          @change="onI18nChange"
        >
          <option
            v-for="availableLocale in availableLocales"
            :key="availableLocale"
            :selected="availableLocale === locale"
            :value="availableLocale"
          >
            {{ getLocaleName(availableLocale) }}
          </option>
        </select>
        <label for="vio-cookie-preferences">{{ t('cookies') }}</label>
        <VioButtonColored
          id="vio-cookie-preferences"
          :aria-label="t('preferences')"
          :is-primary="false"
          @click="cookieControl.isModalActive.value = true"
        >
          {{ t('preferences') }}
        </VioButtonColored>
      </div>
    </VioLayoutFooterCategory>
    <template #logo>
      <IconLogo class="mx-12 h-12 w-12 opacity-60 brightness-0 invert" />
    </template>
  </VioLayoutFooter>
</template>

<script setup lang="ts">
import type { Locale } from '@dargmuesli/nuxt-cookie-control/runtime/types'
import { I18N_MODULE_CONFIG } from '@dargmuesli/nuxt-vio/utils/constants'
import type { LocaleObject } from '@nuxtjs/i18n'

import { useStore } from '~/store'

const store = useStore()
const localePath = useLocalePath()
const i18n = useI18n()
const { availableLocales, t } = i18n
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()
const cookieControl = useCookieControl()

// methods
const getLocaleName = (locale: string) => {
  const locales: LocaleObject[] = I18N_MODULE_CONFIG.locales.filter(
    (localeObject) => localeObject.code === locale,
  )

  if (locales.length) {
    return locales[0].name
  } else {
    return undefined
  }
}
const onI18nChange = async (event: Event) =>
  await router.push({
    path: switchLocalePath((event.target as HTMLInputElement).value),
  })

// computations
const locale = computed(() => i18n.locale.value as Locale)
</script>

<i18n lang="yaml">
de:
  cookies: Cookies
  language: Sprache
  legal: Rechtliches
  legalNotice: Impressum
  preferences: Einstellungen
  privacyPolicy: Datenschutz
en:
  cookies: Cookies
  language: Language
  legal: Legal
  legalNotice: Legal notice
  preferences: Preferences
  privacyPolicy: Privacy policy
</i18n>
