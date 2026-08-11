import { parseURL } from 'ufo'

// getServiceHref()/getRootHost() truncate any host to its last two DNS
// labels, which would mangle a multi-label external endpoint host - hence
// plain concatenation instead of routing this through getSiteServiceHref.
const crealS3EndpointHost = `${process.env.NUXT_PUBLIC_CREAL_S3_BUCKET}.${parseURL(process.env.NUXT_PUBLIC_CREAL_S3_ENDPOINT).host}`

export const GET_CSP = ({
  getSiteServiceHref,
}: {
  getSiteServiceHref: ReturnType<typeof useGetServiceHref>
}) => {
  const hrefBackend = getSiteServiceHref({ isSsr: false, name: 'backend' })
  const hrefPostgraphile = getSiteServiceHref({
    isSsr: false,
    name: 'creal-postgraphile',
  })
  const hrefS3 = `https://${crealS3EndpointHost}`
  const hrefStrapi = getSiteServiceHref({
    isSsr: false,
    name: 'creal-strapi',
  })

  return {
    // creal
    'connect-src': [
      `${hrefBackend}/api/`, // contact form
      hrefPostgraphile,
      hrefStrapi,
      'https://cdn.plyr.io', // plyr
    ],
    'font-src': ["'self'"], // og-image
    'form-action': ["'self'"],
    'img-src': [
      hrefStrapi,
      hrefS3, // playlist cover
    ],
    'media-src': [
      'https://cdn.plyr.io/static/blank.mp4', // plyr
      hrefS3, // music
    ],
    'report-to': 'csp-endpoint',
    'report-uri':
      'https://o4507259039973376.ingest.de.sentry.io/api/4507260561653840/security/?sentry_key=1e53178c1dba9b39147de4a21853a3e3',
    'style-src': [
      "'unsafe-inline'", // TODO: remove when Nuxt loading indicator and headlessui (Dialog) work without it
    ],
  }
}
