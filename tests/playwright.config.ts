// TODO: remove jiti (https://github.com/microsoft/playwright/issues/14303)
import { createJiti } from 'jiti'

const moduleFileUrl = new URL(import.meta.url)
const jiti = createJiti(moduleFileUrl.pathname)
const vioConfiguration = jiti(
  './node_modules/@dargmuesli/nuxt-vio-testing/playwright.config',
).default

export default vioConfiguration
