import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

export const FETCH_RETRY = 3
export const LOCALES: LocaleObject[] = [
  {
    code: 'en',
    file: 'en.json',
    name: 'English',
    iso: 'en', // Will be used as catchall locale by default.
  },
  {
    code: 'de',
    file: 'de.json',
    name: 'Deutsch',
    iso: 'de',
  },
]
export const PLAYER_PREFIX = 'player/'
export const SITE_NAME = 'cReal'
export const TIMEZONE_COOKIE_NAME = 'c_tz'
export const TIMEZONE_HEADER_KEY = 'X-Timezone'
