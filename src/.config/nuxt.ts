import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/utils/nuxt'
// import { SITE_URL } from '@dargmuesli/nuxt-vio/utils/constants'
import { defu } from 'defu'

import { SITE_NAME, STAGING_HOST } from '../utils/constants'
// import { GET_CSP } from '../server/utils/constants'

export default defineNuxtConfig(
  defu(
    {
      extends: ['@dargmuesli/nuxt-vio'],
      modules: [
        '@nuxt/scripts',
        '@nuxtjs/turnstile',

        // // nuxt-security: apply content security policy at build time
        // (_options, nuxt) => {
        //   if (nuxt.options._generate) {
        //     if (nuxt.options.security.headers) {
        //       nuxt.options.security.headers.contentSecurityPolicy = defu(
        //         GET_CSP(SITE_URL),
        //         nuxt.options.security.headers.contentSecurityPolicy,
        //       )
        //     }
        //   }
        // },
      ],
      runtimeConfig: {
        public: {
          creal: {
            s3: {
              bucket: 'creal-audio',
              endpoint: 'https://s3.nl-ams.scw.cloud',
              region: 'nl-ams',
            },
          },
          turnstile: {
            siteKey: '0x4AAAAAAAQiMSbON1vdesv0',
          },
        },
      },
      vite: {
        optimizeDeps: {
          include: [
            '@dargmuesli/nuxt-vio/utils/constants',
            '@headlessui/vue',
            '@heroicons/vue/24/outline',
            '@vuelidate/core',
            '@vuelidate/validators',
            'html-to-text',
            'lodash-es',
            'marked',
            'plyr',
            'pretty-bytes',
          ],
        },
      },

      // modules
      colorMode: {
        preference: 'dark',
      },
      cookieControl: {
        isControlButtonEnabled: false,
      },
      gtag: {
        id: 'G-K4R41W62BR',
      },
      site: {
        identity: {
          type: 'Person',
        },
        twitter: '@dargmuesli',
      },
      turnstile: {
        secretKeyPath:
          process.env.NUXT_PUBLIC_SITE_URL ||
          process.env.NODE_ENV === 'production'
            ? '/run/secrets/jonas-thelemann_turnstile-key'
            : undefined,
      },
    },
    VIO_NUXT_BASE_CONFIG({
      siteName: SITE_NAME,
      stagingHost: STAGING_HOST,
    }),
  ),
)
