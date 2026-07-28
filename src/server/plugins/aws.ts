import { consola } from 'consola'
import { S3Client } from '@aws-sdk/client-s3'

export default defineNitroPlugin((nitroApp) => {
  const runtimeConfig = useRuntimeConfig()

  if (!runtimeConfig.private.creal.s3.accessKeyId) {
    ;(import.meta.dev ? consola.warn : consola.error)(
      'AWS access key id is not set',
    )
    return
  }

  if (
    runtimeConfig.private.creal.s3.accessKeyId ===
    DARGSTACK_SECRET_UNUSED_THIRD_PARTY
  ) {
    consola.warn(
      'AWS access key id not set in stack as provided by third party',
    )
    return
  }

  if (!runtimeConfig.private.creal.s3.secretAccessKey) {
    ;(import.meta.dev ? consola.warn : consola.error)(
      'AWS secret access key is not set',
    )
    return
  }

  if (
    runtimeConfig.private.creal.s3.secretAccessKey ===
    DARGSTACK_SECRET_UNUSED_THIRD_PARTY
  ) {
    consola.warn(
      'AWS secret access key not set in stack as provided by third party',
    )
    return
  }

  const s3 = new S3Client({
    credentials: {
      accessKeyId: runtimeConfig.private.creal.s3.accessKeyId,
      secretAccessKey: runtimeConfig.private.creal.s3.secretAccessKey,
    },
    endpoint: runtimeConfig.public.creal.s3.endpoint, // can't use minio as signed url is not publicly resolvable
    region: runtimeConfig.public.creal.s3.region,
  })

  nitroApp.hooks.hook('request', (event) => {
    event.context.$s3 = s3
  })
})
