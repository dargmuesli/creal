import fs from 'fs'

export const STACK_DOMAIN =
  process.env.NUXT_ENV_STACK_DOMAIN || 'localhost:3000'
export const BASE_URL = // If NUXT_ENV_STACK_DOMAIN is missing, we assume that a http dev env is used.
  (process.env.NUXT_ENV_STACK_DOMAIN === undefined ? 'http' : 'https') +
  '://' +
  STACK_DOMAIN
export const AWS_BUCKET_NAME =
  typeof window === 'undefined'
    ? fs.readFileSync('/run/secrets/creal_aws-bucket', 'utf8')
    : ''

export default (_, inject) => {
  inject('baseUrl', BASE_URL)
}
