import { useVioAuthStore } from '@dargmuesli/nuxt-vio/store/auth'
import {
  createClient,
  ssrExchange as getSsrExchange,
  fetchExchange,
  type ClientOptions,
  type SSRData,
} from '@urql/core'
// import type { Data } from '@urql/exchange-graphcache'
import {
  /* Cache, */ offlineExchange as getOfflineExchange,
} from '@urql/exchange-graphcache'
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage'
// import { relayPagination } from '@urql/exchange-graphcache/extras'
import { devtoolsExchange } from '@urql/devtools'
import { provideClient } from '@urql/vue'
import { consola } from 'consola'
import { ref } from 'vue'

import schema from '~/gql/generated/introspection'
// import type { GraphCacheConfig } from '~/gql/generated/graphcache'
// import { cacheExchange } from '@urql/exchange-graphcache'

// import {
//   authenticationAnonymous,
//   getJwtFromCookie,
//   jwtRefresh,
// } from '~/utils/auth'

const SSR_KEY = '__URQL_DATA__'
// const invalidateCache = (
//   cache: Cache,
//   name: string,
//   args?: { input: { id: any } }
// ) =>
//   args
//     ? cache.invalidate({ __typename: name, id: args.input.id })
//     : cache
//         .inspectFields('Query')
//         .filter((field) => field.fieldName === name)
//         .forEach((field) => {
//           cache.invalidate('Query', field.fieldKey)
//         })
// TODO: create manual updates that do not require invalidation (https://github.com/maevsi/maevsi/issues/720)
// const listPush = (cache: Cache, fieldName: string, data: Data | null) =>
//   cache
//     .inspectFields('Query')
//     .filter((field) => field.fieldName === fieldName)
//     .forEach((field) => {
//       const dataField = cache.resolve('Query', field.fieldKey)

//       if (typeof dataField !== 'string')
//         throw new Error('Data field is no string!')

//       const allInvitations = cache.resolve(dataField, 'nodes')

//       if (
//         !data ||
//         !Array.isArray(allInvitations) ||
//         !isNonEmptyArrayOfStrings(allInvitations)
//       )
//         throw new Error('Data field is no array!')

// // TODO: insert IDs, not data  (https://github.com/maevsi/maevsi/issues/720)
//       allInvitations.push(data)
//       cache.link('Query', field.fieldKey, allInvitations)
//     })

// const isNonEmptyArrayOfStrings = (value: unknown): value is (string | Data)[] => {
//   return Array.isArray(value) && value.every((item) => typeof item === 'string')
// }

export default defineNuxtPlugin((nuxtApp) => {
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

  // const cacheConfig: GraphCacheConfig = {
  //   schema,
  //   // resolvers: {
  //   //   Query: {
  //   //     allContacts: relayPagination(),
  //   //     allEvents: relayPagination(),
  //   //     allInvitations: relayPagination(),
  //   //     allUploads: relayPagination(),
  //   //   },
  //   // },
  //   storage: makeDefaultStorage(),
  //   // updates: {
  //   //   Mutation: {
  //   //     // create
  //   //     createContact: (_parent, _args, cache, _info) =>
  //   //       invalidateCache(cache, 'allContacts'),
  //   //     createInvitation: (_parent, _args, cache, _info) =>
  //   //       invalidateCache(cache, 'allInvitations'),
  //   //     // TODO: create manual updates that do not require invalidation (https://github.com/maevsi/maevsi/issues/720)
  //   //     // listPush(cache, 'allInvitations', parent.createInvitation),

  //   //     // update
  //   //     profilePictureSet: (_parent, _args, cache, _info) =>
  //   //       invalidateCache(cache, 'profilePictureByUsername'),

  //   //     // delete
  //   //     deleteContactById: (_parent, args, cache, _info) =>
  //   //       invalidateCache(cache, 'Contact', args),
  //   //     deleteInvitationById: (_parent, args, cache, _info) =>
  //   //       invalidateCache(cache, 'Invitation', args),
  //   //   },
  //   // },
  // }

  const cacheExchange = import.meta.client
    ? getOfflineExchange({
        schema,
        storage: makeDefaultStorage(),
      })
    : undefined

  const clientOptions: ClientOptions = {
    requestPolicy: 'cache-and-network',
    fetchOptions: () => {
      const { $pinia } = useNuxtApp()
      const store = useVioAuthStore($pinia)
      const headers = {} as Record<string, string>
      const jwt = store.jwt

      if (jwt) {
        consola.trace('GraphQL request authenticated with: ' + jwt)
        headers.authorization = `Bearer ${jwt}`
      } else {
        consola.trace('GraphQL request without authentication.')
      }

      return { headers }
    },
    url:
      getServiceHref({ name: 'creal-postgraphile', port: 5000 }) + '/graphql',
    exchanges: [
      ...(runtimeConfig.public.vio.isInProduction ? [] : [devtoolsExchange]),
      ...(cacheExchange ? [cacheExchange] : []),
      ssrExchange, // `ssr` must be before `fetchExchange`
      fetchExchange,
    ],
  }
  const client = ref(createClient(clientOptions))

  const urqlReset = () => (client.value = createClient(clientOptions))

  nuxtApp.hook('vue:setup', () => {
    const { $urql } = useNuxtApp()
    provideClient($urql)
  })

  // // Either authenticate anonymously or refresh token on page load.
  // if (nuxtApp.ssrContext?.event) {
  //   const store = useStore(nuxtApp.ssrContext.$pinia)
  //   const jwtFromCookie = getJwtFromCookie({
  //     req: nuxtApp.ssrContext.event.node.req,
  //   })

  //   if (jwtFromCookie?.jwtDecoded.id) {
  //     await jwtRefresh({
  //       client: client.value,
  //       $urqlReset: urqlReset,
  //       store,
  //       res: nuxtApp.ssrContext.event.node.res,
  //       id: jwtFromCookie.jwtDecoded.id as string,
  //     })
  //   } else {
  //     await authenticationAnonymous({
  //       client: client.value,
  //       $urqlReset: urqlReset,
  //       store,
  //       res: nuxtApp.ssrContext.event.node.res,
  //     })
  //   }
  // }

  return {
    provide: {
      urql: client,
      urqlReset,
    },
  }
})
