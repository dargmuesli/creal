import { cleanupCsp } from '@dargmuesli/nuxt-vio/server/plugins/security'
import { defu } from 'defu'
import { GET_CSP } from '../../server/utils/constants'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('nuxt-security:routeRules', async (routeRules) => {
    const siteUrl = useServerSiteUrl()

    routeRules['/**'] = cleanupCsp(
      defu(
        {
          headers: {
            contentSecurityPolicy: GET_CSP(siteUrl),
          },
        },
        routeRules['/**'],
      ),
    )
  })
})
