import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

export const AWS_BUCKET_NAME_DEVELOPMENT = 'creal-audio-dev'
export const AWS_BUCKET_NAME_PRODUCTION = 'creal-audio'
export const CYPRESS_BASE_URL = 'http://localhost:3000'
export const FETCH_RETRY = 3
export const LOCALES: LocaleObject[] = [
  {
    code: 'en',
    name: 'English',
    iso: 'en', // Will be used as catchall locale by default.
  },
  {
    code: 'de',
    name: 'Deutsch',
    iso: 'de',
  },
]
export const PLAYER_PREFIX = 'player/'
export const TIMEZONE_COOKIE_NAME = 'c_tz'
export const TIMEZONE_HEADER_KEY = 'X-Timezone'
