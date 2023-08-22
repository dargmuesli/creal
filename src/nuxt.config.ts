import { I18N_MODULE_CONFIG } from '@dargmuesli/nuxt-vio/utils/constants'

import { SITE_NAME } from './utils/constants'

const BASE_URL =
  (process.env.NUXT_PUBLIC_STACK_DOMAIN ? 'https' : 'http') +
  '://creal.' +
  (process.env.NUXT_PUBLIC_STACK_DOMAIN ||
    `${process.env.HOST || 'localhost'}:${
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? '3000'
        : '3001'
    }`)

export default defineNuxtConfig({
  app: {
    head: {
      title: SITE_NAME, // fallback data to prevent invalid html at generation
    },
  },
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
      i18n: {
        baseUrl: BASE_URL,
      },
      vio: {
        stagingHost:
          process.env.NODE_ENV !== 'production' &&
          !process.env.NUXT_PUBLIC_STACK_DOMAIN
            ? 'jonas-thelemann.de'
            : undefined,
      },
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        esModuleInterop: true,
        // moduleResolution: 'bundler',
        // noErrorTruncation: true,
      },
    },
  },

  // modules
  i18n: I18N_MODULE_CONFIG, // `langDir`, `lazy` and `locales` must be configured to extend a layer having lazy-loaded translations (https://v8.i18n.nuxtjs.org/guide/layers#locales)
  site: {
    name: SITE_NAME,
    url: BASE_URL,
  },
})
