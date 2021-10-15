import fs from 'fs'

import { Inject } from '@nuxt/types/app'
import { Context } from '@nuxt/types'

const secretPathAwsBucket = '/run/secrets/creal_aws-bucket'

export const STACK_DOMAIN =
  process.env.NUXT_ENV_STACK_DOMAIN || 'localhost:3000'
export const BASE_URL = // If NUXT_ENV_STACK_DOMAIN is missing, we assume that a http dev env is used.
  (process.env.NUXT_ENV_STACK_DOMAIN === undefined ? 'http' : 'https') +
  '://creal.' +
  STACK_DOMAIN
export const AWS_BUCKET_NAME =
  typeof window === 'undefined' && fs.existsSync(secretPathAwsBucket)
    ? fs.readFileSync(secretPathAwsBucket, 'utf8')
    : ''

export default (_: Context, inject: Inject) => {
  inject('baseUrl', BASE_URL)
}

declare module 'vue/types/vue' {
  interface Vue {
    $baseUrl: typeof BASE_URL
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $baseUrl: typeof BASE_URL
  }
  interface Context {
    $baseUrl: typeof BASE_URL
  }
}
