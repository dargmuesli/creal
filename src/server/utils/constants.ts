import { defu } from 'defu'
import { parseURL } from 'ufo'

// getServiceHref() truncates any host to its last two DNS labels, which would mangle a multi-label external endpoint host.
// Hence this one is concatenated plainly instead of being routed through getSiteServiceHref.
const crealS3EndpointHost = `${process.env.NUXT_PUBLIC_CREAL_S3_BUCKET}.${parseURL(process.env.NUXT_PUBLIC_CREAL_S3_ENDPOINT).host}`

export const GET_CSP = ({
  getSiteServiceHref,
}: {
  getSiteServiceHref: ReturnType<typeof useGetServiceHref>
}) => {
  const sentryConfig = useRuntimeConfig().public.sentry

  // The CSP is enforced by the browser, so every host must be the public one instead of the internal service address.
  const hrefBackend = getSiteServiceHref({
    allowInternal: false,
    name: 'backend',
    path: 'api/',
  })
  const hrefPostgraphile = getSiteServiceHref({
    allowInternal: false,
    name: 'creal-postgraphile',
  })
  const hrefS3 = `https://${crealS3EndpointHost}`
  const hrefStrapi = getSiteServiceHref({
    allowInternal: false,
    name: 'creal-strapi',
  })

  return defu(
    {
      // creal
      'connect-src': [
        hrefBackend, // contact form
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
      'report-to': 'sentry',
      'style-src': [
        "'unsafe-inline'", // TODO: remove when Nuxt loading indicator and headlessui (Dialog) work without it
      ],
    },
    {
      // Sentry (vio only wires this in automatically for static builds)
      ...(sentryConfig.host && sentryConfig.project.id
        ? {
            'connect-src': [
              `https://${sentryConfig.host}/api/${sentryConfig.project.id}/envelope/`,
            ],
            'worker-src': ['blob:'],
          }
        : {}),
    },
  )
}
