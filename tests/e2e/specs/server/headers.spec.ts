import { vioTest } from '@dargmuesli/nuxt-vio-testing/e2e/fixtures/vioTest'
import { SITE_URL } from '@dargmuesli/nuxt-vio-testing/e2e/utils/constants'
import { expect } from '@playwright/test'

vioTest.describe('content security policy', () => {
  // The policy is assembled in a Nitro plugin hook that runs once at startup, where a throw only surfaces as an unhandled rejection.
  // The server then keeps listening but serves a bare `default-src 'none'` policy that blocks every script and style, so assert that the creal specific hosts actually made it into the header.
  vioTest('contains the creal service hosts', async ({ request }) => {
    if (process.env.VIO_SERVER === 'static') return // a statically served build runs no Nitro plugins and sends no such header

    const csp = (await request.get('/')).headers()['content-security-policy']
    const rootHost = new URL(SITE_URL).host.replace(/^app\./, '')

    expect(csp).toContain(`https://backend.${rootHost}/api/`)
    expect(csp).toContain(`https://creal-postgraphile.${rootHost}`)
    expect(csp).toContain(`https://creal-strapi.${rootHost}`)
    expect(csp).toContain('https://cdn.plyr.io')
  })
})
