import { VIO_NUXT_BASE_CONFIG } from '@dargmuesli/nuxt-vio/utils/constants'
import { defu } from 'defu'

import { SITE_NAME } from './utils/constants'

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
  // eslint-disable-next-line compat/compat
  new URL(
    process.env.NUXT_PUBLIC_CREAL_S3_ENDPOINT || 'https://s3.nl-ams.scw.cloud',
  ).host

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
      vite: {
        optimizeDeps: {
          include: [
            '@dargmuesli/nuxt-vio/utils/constants',
            '@vuelidate/core',
            '@vuelidate/validators',
            'html-to-text',
            'lodash-es',
            'marked',
            'plyr',
            'pretty-bytes',
            'sweetalert2',
          ],
        },
      },

      // modules
      cookieControl: {
        isControlButtonEnabled: false,
      },
      security: {
        headers: {
          contentSecurityPolicy: {
            'connect-src': [
              `https://creal-postgraphile.${STAGING_HOST}`, // TODO: use `${getDomainTldPort(stagingHostOrHost)}` (https://github.com/Baroshem/nuxt-security/pull/233)
              `https://creal-strapi.${STAGING_HOST}`, // TODO: use `${getDomainTldPort(stagingHostOrHost)}` (https://github.com/Baroshem/nuxt-security/pull/233)
              'https://cdn.plyr.io', // plyr
            ],
            'form-action': ["'self'"],
            'img-src': [
              `https://creal-strapi.${STAGING_HOST}`, // TODO: use `${getDomainTldPort(stagingHostOrHost)}` (https://github.com/Baroshem/nuxt-security/pull/233)
              `https://${crealS3EndpointHost}`, // playlist cover
            ],
            'media-src': [
              'https://cdn.plyr.io/static/blank.mp4', // plyr
              `https://${crealS3EndpointHost}`, // music
            ],
            'prefetch-src': ["'self'"],
            'report-uri': ['https://dargmuesli.report-uri.com/r/d/csp/enforce'],
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
      siteName: SITE_NAME,
      stagingHost: STAGING_HOST,
    }),
  ),
)
