import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/utils/nuxt'
import { defu } from 'defu'

import { SITE_NAME } from '../utils/constants'

const STAGING_HOST = 'jonas-thelemann.de'
const stagingHost =
  process.env.NODE_ENV !== 'production' && !process.env.NUXT_PUBLIC_SITE_URL
    ? STAGING_HOST
    : undefined
const isInProduction = process.env.NODE_ENV === 'production'

const crealS3EndpointHost =
  (stagingHost || isInProduction
    ? `${process.env.NUXT_PUBLIC_CREAL_S3_BUCKET || 'creal-audio'}.`
    : '') +
  new URL(
    process.env.NUXT_PUBLIC_CREAL_S3_ENDPOINT || 'https://s3.nl-ams.scw.cloud',
  ).host

export default defineNuxtConfig(
  defu(
    {
      extends: ['@dargmuesli/nuxt-vio'],
      modules: ['@nuxt/scripts', '@nuxtjs/turnstile'],
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
      security: {
        headers: {
          contentSecurityPolicy: defu(
            {
              // creal
              'connect-src': [
                `https://backend.${STAGING_HOST}/api/`, // contact form
                `https://creal-postgraphile.${STAGING_HOST}`,
                `https://creal-strapi.${STAGING_HOST}`,
                'https://cdn.plyr.io', // plyr
                'https://o4507259039973376.ingest.sentry.io/api/4507260561653840/security/', // TODO: remove together with `report-uri` once browsers support the `Report-To` header (https://caniuse.com/mdn-http_headers_report-to)
              ],
              'form-action': ["'self'"],
              'img-src': [
                `https://creal-strapi.${STAGING_HOST}`,
                `https://${crealS3EndpointHost}`, // playlist cover
              ],
              'media-src': [
                'https://cdn.plyr.io/static/blank.mp4', // plyr
                `https://${crealS3EndpointHost}`, // music
              ],
              'prefetch-src': ["'self'"],
              'report-to': 'csp-endpoint',
              'report-uri':
                'https://o4507259039973376.ingest.de.sentry.io/api/4507260561653840/security/?sentry_key=1e53178c1dba9b39147de4a21853a3e3',
              'style-src': [
                "'unsafe-inline'", // Nuxt loading indicator, headlessui (Dialog)
              ],
            },
            {
              // Cloudflare Turnstile
              'frame-src': ['https://challenges.cloudflare.com'],
              'script-src-elem': ['https://challenges.cloudflare.com'],
            },
          ),
        },
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
