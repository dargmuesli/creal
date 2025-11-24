import { getRootHost } from '@dargmuesli/nuxt-vio/shared/utils/networking'
import { defu } from 'defu'
import { parseURL } from 'ufo'

export const DARGSTACK_SECRET_UNUSED_THIRD_PARTY = 'UNSET THIRD PARTY SECRET'

const crealS3EndpointHost = `${process.env.NUXT_PUBLIC_CREAL_S3_BUCKET}.${parseURL(process.env.NUXT_PUBLIC_CREAL_S3_ENDPOINT).host}`

export const GET_CSP = (siteUrl: URL) => {
  const domainTldPort = IS_IN_FRONTEND_DEVELOPMENT
    ? PRODUCTION_HOST
    : getRootHost(siteUrl.host)

  return defu(
    {
      // creal
      'connect-src': [
        `https://backend.${domainTldPort}/api/`, // contact form
        `https://creal-postgraphile.${domainTldPort}`,
        `https://creal-strapi.${domainTldPort}`,
        'https://cdn.plyr.io', // plyr
      ],
      'form-action': ["'self'"],
      'img-src': [
        `https://creal-strapi.${domainTldPort}`,
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
  )
}
