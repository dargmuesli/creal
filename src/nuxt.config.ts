import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/utils/constants'

import { BASE_URL, SITE_NAME } from './utils/constants'

export default defineNuxtConfig({
  ...VIO_NUXT_BASE_CONFIG({
    baseUrl: BASE_URL,
    siteName: SITE_NAME,
    stagingHost: 'jonas-thelemann.de',
  }),
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
})
