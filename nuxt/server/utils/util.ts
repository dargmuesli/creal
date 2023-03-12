import { S3Client } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'
import { H3Event } from 'h3'

import { getHost, getServiceHref } from '~/utils/util'

export const getS3Client = (isExternal = false) => {
  const config = useRuntimeConfig()

  return new S3Client({
    credentials: fromIni({
      filepath: '/run/secrets/creal_aws-credentials',
    }),
    endpoint: isExternal ? config.public.s3Endpoint : 'http://minio:9000',
    forcePathStyle: !config.public.stagingHost && !config.public.isInProduction,
    region: config.public.s3Region,
  })
}

export const proxy = async <T>(
  event: H3Event,
  f: (req: H3Event) => Promise<T>
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

  return await f(event)
}
