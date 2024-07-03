import { getDomainTldPort } from '@dargmuesli/nuxt-vio/utils/networking'
import { defu } from 'defu'

import { STAGING_HOST } from '../../utils/constants'

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

export const GET_CSP = (siteUrl: string) => {
  const siteUrlParsed = new URL(siteUrl)

  return defu(
    {
      // creal
      'connect-src': [
        `https://backend.${getDomainTldPort(siteUrlParsed.host)}/api/`, // contact form
        `https://creal-postgraphile.${getDomainTldPort(siteUrlParsed.host)}`,
        `https://creal-strapi.${getDomainTldPort(siteUrlParsed.host)}`,
        'https://cdn.plyr.io', // plyr
      ],
      'form-action': ["'self'"],
      'img-src': [
        `https://creal-strapi.${getDomainTldPort(siteUrlParsed.host)}`,
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
