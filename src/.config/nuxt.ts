import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/shared/utils/nuxt'
import { defu } from 'defu'

import { SITE_NAME, PRODUCTION_HOST } from '../shared/utils/constants'

export default defineNuxtConfig(
  defu(
    {
      css: ['~/assets/css/creal.css'],
      extends: ['@dargmuesli/nuxt-vio'],
      modules: ['@nuxt/scripts', '@nuxtjs/turnstile'],
      nitro: {
        experimental: {
          asyncContext: true,
        },
      },
      runtimeConfig: {
        private: {
          creal: {
            s3: {
              accessKeyId: '',
              secretAccessKey: '',
            },
          },
        },
        public: {
          creal: {
            s3: {
              bucket: 'sutin',
              endpoint:
                'https://f00135e2a8cc575a4bc4817c9521fe71.eu.r2.cloudflarestorage.com',
              region: 'auto',
            },
          },
          turnstile: {
            siteKey: '0x4AAAAAAAQiMSbON1vdesv0',
          },
          vio: {
            proxy: true,
          },
        },
      },
      vite: {
        optimizeDeps: {
          include: [
            '@dargmuesli/nuxt-vio/app/stores/auth',
            '@dargmuesli/nuxt-vio/shared/utils/constants',
            '@headlessui/vue',
            '@heroicons/vue/24/outline',
            '@skjnldsv/vue-plyr',
            '@urql/core',
            '@urql/devtools',
            '@urql/exchange-graphcache',
            '@urql/exchange-graphcache/default-storage',
            '@urql/vue',
            '@vuelidate/core',
            '@vuelidate/validators',
            'clsx',
            'html-to-text',
            'lodash-es',
            'marked',
            'plyr',
            'pretty-bytes',
            'tailwind-merge',
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
      stagingHost: PRODUCTION_HOST,
    }),
  ),
)
