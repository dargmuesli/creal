import { useVioAuthStore } from '@dargmuesli/nuxt-vio/app/stores/auth'
import {
  createClient,
  ssrExchange as getSsrExchange,
  fetchExchange,
} from '@urql/core'
import type { ClientOptions, SSRData } from '@urql/core'
import { offlineExchange as getOfflineExchange } from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
import { devtoolsExchange } from '@urql/devtools'
import { provideClient } from '@urql/vue'
import { consola } from 'consola'
import { ref } from 'vue'

import schema from '~~/gql/generated/introspection'

const SSR_KEY = '__URQL_DATA__'

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useVioAuthStore()
  const runtimeConfig = useRuntimeConfig()
  const getServiceHref = useGetServiceHref()

  const ssrExchange = getSsrExchange({
    isClient: import.meta.client,
  })

  if (import.meta.client) {
    nuxtApp.hook('app:created', () => {
      ssrExchange.restoreData(nuxtApp.payload[SSR_KEY] as SSRData)
    })
  }

  if (import.meta.server) {
    nuxtApp.hook('app:rendered', () => {
      nuxtApp.payload[SSR_KEY] = ssrExchange.extractData()
    })
  }

  const cacheExchange = import.meta.client
    ? getOfflineExchange({
        schema,
        storage: makeDefaultStorage(),
      })
    : undefined

  const clientOptions: ClientOptions = {
    requestPolicy: 'cache-and-network',
    fetchOptions: () => {
      const headers = {} as Record<string, string>

      if (store.jwt) {
        consola.trace('GraphQL request authenticated with: ' + store.jwt)
        headers.authorization = `Bearer ${store.jwt}`
      } else {
        consola.trace('GraphQL request without authentication.')
      }

      return { headers }
    },
    preferGetMethod: false, // TODO: remove with Postgraphile v5
    url:
      getServiceHref({ name: 'creal-postgraphile', port: 5000 }) + '/graphql',
    exchanges: [
      ...(runtimeConfig.public.vio.isInProduction ? [] : [devtoolsExchange]),
      ...(cacheExchange ? [cacheExchange] : []),
      ssrExchange, // `ssrExchange` must be before `fetchExchange`
      fetchExchange,
    ],
  }
  const client = ref(createClient(clientOptions))

  const urqlReset = () => (client.value = createClient(clientOptions))

  nuxtApp.hook('vue:setup', () => {
    const { $urql } = useNuxtApp()
    provideClient($urql)
  })

  return {
    provide: {
      urql: client,
      urqlReset,
    },
  }
})
