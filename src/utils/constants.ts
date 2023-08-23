export const BASE_URL =
  (process.env.NUXT_PUBLIC_STACK_DOMAIN ? 'https' : 'http') +
  '://creal.' +
  (process.env.NUXT_PUBLIC_STACK_DOMAIN ||
    `${process.env.HOST || 'localhost'}:${
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? '3000'
        : '3001'
    }`)
export const PLAYER_PREFIX = 'player/'
export const SITE_NAME = 'DJ cReal'
