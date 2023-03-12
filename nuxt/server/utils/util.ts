import { IncomingMessage } from 'node:http'

import { H3Event } from 'h3'

import { getHost, getServiceHref } from '~/utils/util'

export const proxy = async <T>(
  event: H3Event,
  f: (req: IncomingMessage) => Promise<T>
) => {
  const config = useRuntimeConfig()

  const { req } = event.node

  if (config.public.stagingHost) {
    return await $fetch<ReturnType<typeof f>>(
      getServiceHref({
        host: getHost(req),
        name: 'creal',
        stagingHost: config.public.stagingHost,
      }) + (req.url ?? '')
    )
  }

  return await f(req)
}
