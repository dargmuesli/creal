import {
  VIO_NUXT_BASE_CONFIG,
  SITE_URL,
} from '@dargmuesli/nuxt-vio/utils/constants'
import { defu } from 'defu'

import { SITE_NAME } from './utils/constants'

export default defineNuxtConfig(
  defu(
    {
      extends: ['@dargmuesli/nuxt-vio'],
      runtimeConfig: {
        public: {
          creal: {
            s3: {
              bucket: 'creal-audio',
              endpoint: 'https://s3.nl-ams.scw.cloud',
              region: 'nl-ams',
            },
          },
        },
      },
      site: {
        identity: {
          type: 'Person',
        },
        twitter: '@dargmuesli',
      },
    },
    VIO_NUXT_BASE_CONFIG({
      siteUrl: SITE_URL,
      siteName: SITE_NAME,
      stagingHost: 'jonas-thelemann.de',
    }),
  ),
)
