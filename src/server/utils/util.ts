import { S3Client } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'
import { getHost, getServiceHref } from '@dargmuesli/nuxt-vio/utils/networking'
import { H3Event } from 'h3'

export const getS3Client = (isExternal = false) => {
  const config = useRuntimeConfig()

  return new S3Client({
    credentials: fromIni({
      filepath: '/run/secrets/creal_aws-credentials',
    }),
    endpoint:
      config.public.vio.stagingHost ||
      config.public.vio.isInProduction ||
      isExternal
        ? config.public.creal.s3.endpoint
        : 'http://minio:9000',
    forcePathStyle:
      !config.public.vio.stagingHost && !config.public.vio.isInProduction,
    region: config.public.creal.s3.region,
  })
}

export const proxy = async <T>(
  event: H3Event,
  f: (req: H3Event) => Promise<T>,
) => {
  const config = useRuntimeConfig()

  const { req } = event.node

  if (config.public.vio.stagingHost) {
    return await $fetch<ReturnType<typeof f>>(
      getServiceHref({
        host: getHost(req),
        name: 'creal',
        stagingHost: config.public.vio.stagingHost,
      }) + (req.url ?? ''),
    )
  }

  return await f(event)
}
