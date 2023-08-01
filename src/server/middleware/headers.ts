import { defu } from 'defu'
import { appendHeader, defineEventHandler } from 'h3'

import { TIMEZONE_HEADER_KEY } from '~/utils/constants'
import { getDomainTldPort, getHost, getTimezone } from '~/utils/util'

const getCsp = (host: string): Record<string, Array<string>> => {
  const hostName = host.replace(/:[0-9]+$/, '')
  const config = useRuntimeConfig()

  const stagingHostOrHost = config.public.stagingHost || host
  const s3EndpointHost =
    (config.public.stagingHost || config.public.isInProduction
      ? `${config.public.s3Bucket}.`
      : '') + new URL(config.public.s3Endpoint).host // eslint-disable-line compat/compat

  const base = {
    'base-uri': ["'none'"], // Mozilla Observatory.
    'connect-src': [
      "'self'", // Nuxt development.
      `https://creal-postgraphile.${getDomainTldPort(stagingHostOrHost)}`,
      `https://creal-strapi.${getDomainTldPort(stagingHostOrHost)}`,
      'https://cdn.plyr.io', // Plyr.
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
    ],
    'default-src': ["'none'"],
    'font-src': ["'self'"],
    'form-action': ["'self'"], // Mozilla Observatory: "none".
    'frame-ancestors': ["'none'"], // Mozilla Observatory.
    'img-src': [
      "'self'",
      'data:',
      `https://creal-strapi.${getDomainTldPort(stagingHostOrHost)}`,
      'https://*.google-analytics.com',
      `https://${s3EndpointHost}`, // Playlist cover.
    ],
    'manifest-src': ["'self'"],
    'media-src': [
      'https://cdn.plyr.io/static/blank.mp4', // Plyr.
      `https://${s3EndpointHost}`, // Music.
    ],
    'prefetch-src': ["'self'"],
    'report-uri': ['https://dargmuesli.report-uri.com/r/d/csp/enforce'],
    // TODO: evaluate header (https://github.com/maevsi/maevsi/issues/830) // https://stackoverflow.com/questions/62081028/this-document-requires-trustedscripturl-assignment
    // 'require-trusted-types-for': ["'script'"], // csp-evaluator
    'script-src': [
      "'self'",
      'https://static.cloudflareinsights.com',
      'https://*.google-analytics.com',
      'https://www.googletagmanager.com/gtag/js',
      "'unsafe-inline'", // https://github.com/unjs/nitro/issues/81
      "'unsafe-eval'", // https://github.com/unjs/nitro/issues/81
    ],
    'style-src': ["'self'", "'unsafe-inline'"], // Tailwind
  }

  const development = {
    'connect-src': [
      `http://${hostName}:24678/_nuxt/`,
      `https://${hostName}:24678/_nuxt/`,
      `ws://${hostName}:24678/_nuxt/`,
      `wss://${hostName}:24678/_nuxt/`,
    ],
    'default-src': ["'self'"], // nuxt-og-image
    'font-src': ['https://fonts.gstatic.com/s/inter/v12/'], // nuxt-og-image
    'frame-ancestors': ["'self'"], // nuxt-og-image
    'script-src': ['https://cdn.tailwindcss.com/'], // nuxt-og-image
    'style-src': [
      'https://cdn.jsdelivr.net/npm/gardevoir https://fonts.googleapis.com/css2',
    ], // nuxt-og-image
  }

  const production = {
    'connect-src': [`https://${stagingHostOrHost}/cdn-cgi/rum`],
  }

  return defu(base, config.public.isInProduction ? production : development)
}

const getCspAsString = (host: string) => {
  const csp = getCsp(host)
  let result = ''

  Object.keys(csp).forEach((key) => {
    result += `${key} ${csp[key].join(' ')};`
  })

  return result
}

export default defineEventHandler(async (event) => {
  event.node.req.headers[TIMEZONE_HEADER_KEY] = await getTimezone(event)

  const host = getHost(event.node.req)

  appendHeader(event, 'Content-Security-Policy', getCspAsString(host))
  // appendHeader(event, 'Cross-Origin-Embedder-Policy', 'require-corp') // https://stackoverflow.com/questions/71904052/getting-notsameoriginafterdefaultedtosameoriginbycoep-error-with-helmet
  appendHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin')
  appendHeader(event, 'Cross-Origin-Resource-Policy', 'same-origin')
  // appendHeader(event, 'Expect-CT', 'max-age=0') // deprecated (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT)
  appendHeader(
    event,
    'NEL',
    '\'{"report_to":"default","max_age":31536000,"include_subdomains":true}\'',
  )
  appendHeader(event, 'Origin-Agent-Cluster', '?1')
  appendHeader(event, 'Permissions-Policy', '')
  appendHeader(event, 'Referrer-Policy', 'no-referrer')
  appendHeader(
    event,
    'Report-To',
    '\'{"group":"default","max_age":31536000,"endpoints":[{"url":"https://dargmuesli.report-uri.com/a/d/g"}],"include_subdomains":true}\'',
  )
  appendHeader(event, 'X-Content-Type-Options', 'nosniff')
  appendHeader(event, 'X-DNS-Prefetch-Control', 'off')
  appendHeader(event, 'X-Download-Options', 'noopen')
  appendHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  appendHeader(event, 'X-Permitted-Cross-Domain-Policies', 'none')
  appendHeader(event, 'X-XSS-Protection', '0')

  if (process.env.NODE_ENV === 'production') {
    appendHeader(
      event,
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    )
  }
})