import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/utils/constants'
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
      nitro: {
        experimental: {
          openAPI: process.env.NODE_ENV === 'development',
        },
      },

      // modules
      cookieControl: {
        isControlButtonEnabled: false,
      },
      site: {
        identity: {
          type: 'Person',
        },
        twitter: '@dargmuesli',
      },
    },
    VIO_NUXT_BASE_CONFIG({
      siteName: SITE_NAME,
      stagingHost: 'jonas-thelemann.de',
    }),
  ),
)
