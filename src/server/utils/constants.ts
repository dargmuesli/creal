import { defu } from 'defu'
import { parseURL } from 'ufo'

const crealS3EndpointHost = `${process.env.NUXT_PUBLIC_CREAL_S3_BUCKET}.${parseURL(process.env.NUXT_PUBLIC_CREAL_S3_ENDPOINT).host}`

export const GET_CSP = ({ siteUrl }: { siteUrl: URL }) => {
  const domainTldPort = IS_IN_FRONTEND_DEVELOPMENT
    ? PRODUCTION_HOST
    : getRootHost(siteUrl.host)
  const sentryConfig = useRuntimeConfig().public.sentry

  return defu(
    {
      // creal
      'connect-src': [
        `https://backend.${domainTldPort}/api/`, // contact form
        `https://creal-postgraphile.${domainTldPort}`,
        `https://creal-strapi.${domainTldPort}`,
        'https://cdn.plyr.io', // plyr
      ],
      'font-src': ["'self'"], // og-image
      'form-action': ["'self'"],
      'img-src': [
        `https://creal-strapi.${domainTldPort}`,
        `https://${crealS3EndpointHost}`, // playlist cover
      ],
      'media-src': [
        'https://cdn.plyr.io/static/blank.mp4', // plyr
        `https://${crealS3EndpointHost}`, // music
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
