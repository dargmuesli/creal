<template>
  <VioLayoutFooter :class="{ 'mb-20': store.playerData.isVisible }">
    <VioLayoutFooterCategory class="basis-full" :heading="t('legal')">
      <VioLink :to="localePath('/legal-notice')">
        {{ t('legalNotice') }}
      </VioLink>
      <VioLink :to="localePath('/privacy-policy')">
        {{ t('privacyPolicy') }}
      </VioLink>
    </VioLayoutFooterCategory>
    <VioLayoutFooterCategory class="basis-full" :heading="t('preferences')">
      <div class="grid grid-cols-2 grid-rows-2 items-center gap-2">
        <label for="vio-i18n-select">{{ t('language') }}</label>
        <select
          id="vio-i18n-select"
          class="form-input pr-8"
          @change="onI18nChange"
        >
          <option
            v-for="localeItem in locales"
            :key="localeItem.code"
            :selected="localeItem.code === locale"
            :value="localeItem.code"
          >
            {{ localeItem.name }}
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
      <VioLink :aria-label="t('faq')" :to="localePath('/faq')">
        <CrIconLogo class="mx-12 h-12 w-12 opacity-60 brightness-0 invert" />
      </VioLink>
    </template>
  </VioLayoutFooter>
</template>

<script setup lang="ts">
import type { Locale } from '@intlify/core-base'

const store = useStore()
const localePath = useLocalePath()
const { t, locale, locales } = useI18n()
const router = useRouter()
const switchLocalePath = useSwitchLocalePath()
const cookieControl = useCookieControl()

// methods
const onI18nChange = async (event: Event) => {
  await router.push({
    path: switchLocalePath((event.target as HTMLInputElement).value as Locale),
  })
}
</script>

<i18n lang="yaml">
de:
  cookies: Cookies
  faq: FAQ
  language: Sprache
  legal: Rechtliches
  legalNotice: Impressum
  preferences: Einstellungen
  privacyPolicy: Datenschutz
en:
  cookies: Cookies
  faq: FAQ
  language: Language
  legal: Legal
  legalNotice: Legal notice
  preferences: Preferences
  privacyPolicy: Privacy policy
</i18n>
