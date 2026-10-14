import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { defineEventHandler } from 'nuxt/server'
import { useEvent } from 'nitropack/runtime'
import { parseURL, parseQuery } from 'ufo'

import { useS3 } from '#server/utils/dependencies/aws'
import { useProxy } from '#server/utils/network'

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  const proxy = useProxy()
  const getSignedUrlCustom = useGetSignedUrl()

  if (runtimeConfig.public.vio.proxy) {
    return proxy(getSignedUrlCustom)
  }

  return getSignedUrlCustom()
})

const useGetSignedUrl = () => {
  const event = useEvent()
  const config = useRuntimeConfig()
  const { client: s3 } = useS3()

  const { req } = event.node
  const key = parseQuery(parseURL(req.url).search).key

  if (!key || Array.isArray(key)) {
    throw createError({ status: 400, statusText: 'Key is undefined or array' })
  }

  return async () =>
    await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: config.public.creal.s3.bucket,
        Key: key,
      }),
      {
        expiresIn: 21600, // 6h
      },
    )
}
