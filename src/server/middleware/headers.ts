import { defu } from 'defu'
import { appendHeader, defineEventHandler } from 'h3'

import {
  getDomainTldPort,
  getHost,
} from '@dargmuesli/nuxt-vio/utils/networking'

const getCsp = (host: string): Record<string, Array<string>> => {
  const hostName = host.replace(/:[0-9]+$/, '')
  const config = useRuntimeConfig()

  const stagingHostOrHost = config.public.vio.stagingHost || host
  const crealS3EndpointHost =
    (config.public.vio.stagingHost || config.public.vio.isInProduction
      ? `${config.public.creal.s3.bucket}.`
      : '') + new URL(config.public.creal.s3.endpoint).host

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
      `https://${crealS3EndpointHost}`, // Playlist cover.
    ],
    'manifest-src': ["'self'"],
    'media-src': [
      'https://cdn.plyr.io/static/blank.mp4', // Plyr.
      `https://${crealS3EndpointHost}`, // Music.
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
      'https://polyfill.io/v3/polyfill.min.js', // ESLint plugin compat
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

  return defu(base, config.public.vio.isInProduction ? production : development)
}

const getCspAsString = (host: string) => {
  const csp = getCsp(host)
  let result = ''

  Object.keys(csp).forEach((key) => {
    result += `${key} ${csp[key].join(' ')};`
  })

  return result
}

export default defineEventHandler((event) => {
  const host = getHost(event.node.req)

  appendHeader(event, 'Content-Security-Policy', getCspAsString(host))
})
