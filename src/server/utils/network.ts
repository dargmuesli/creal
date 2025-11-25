import {
  getHost,
  getServiceHref,
} from '@dargmuesli/nuxt-vio/shared/utils/networking'

export const useProxy = () => {
  const event = useEvent()
  const config = useRuntimeConfig()

  return async <T>(f: () => Promise<T>) => {
    if (config.public.vio.stagingHost) {
      return await $fetch<ReturnType<typeof f>>(
        getServiceHref({
          host: getHost(event),
          name: 'creal',
          stagingHost: config.public.vio.stagingHost,
        }) + (event.node.req.url ?? ''),
      )
    }

    return await f()
  }
}
