import { S3Client } from '@aws-sdk/client-s3'
import {
  getHost,
  getServiceHref,
} from '@dargmuesli/nuxt-vio/shared/utils/networking'
import { consola } from 'consola'
import type { H3Event } from 'h3'

export const getS3Client = (isExternal = false) => {
  const config = useRuntimeConfig()

  if (!config.private.creal.s3.accessKeyId) {
    ;(import.meta.dev ? consola.warn : consola.error)(
      'AWS access key id is not set',
    )
    return
  }

  if (!config.private.creal.s3.secretAccessKey) {
    ;(import.meta.dev ? consola.warn : consola.error)(
      'AWS secret access key is not set',
    )
    return
  }

  return new S3Client({
    credentials: {
      accessKeyId: config.private.creal.s3.accessKeyId,
      secretAccessKey: config.private.creal.s3.secretAccessKey,
    },
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
  f: (event: H3Event) => Promise<T>,
) => {
  const config = useRuntimeConfig()

  if (config.public.vio.stagingHost) {
    return await $fetch<ReturnType<typeof f>>(
      getServiceHref({
        host: getHost(event),
        name: 'creal',
        stagingHost: config.public.vio.stagingHost,
      }) + (event.node.req.url ?? ''),
    )
  }

  return await f(event)
}
