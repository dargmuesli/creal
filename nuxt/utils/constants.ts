import fs from 'fs'

import { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'

const secretPathAwsBucket = '/run/secrets/creal_aws-bucket'

export const AWS_BUCKET_NAME =
  typeof window === 'undefined' && fs.existsSync(secretPathAwsBucket)
    ? fs.readFileSync(secretPathAwsBucket, 'utf8')
    : ''
export const CYPRESS_BASE_URL = 'http://localhost:3000'
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
