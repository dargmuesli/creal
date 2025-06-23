import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { H3Event } from 'h3'
import { parseURL, parseQuery } from 'ufo'

export default defineEventHandler(async (event) => {
  return await proxy(event, signedUrl)
})

const signedUrl = async (event: H3Event) => {
  const { req } = event.node
  const config = useRuntimeConfig()

  const s3 = getS3Client(true)

  const key = parseQuery(
    parseURL(req.url !== undefined ? req.url : '', 'https://example.org/')
      .search,
  ).key

  if (!key || Array.isArray(key)) {
    throw createError({ statusCode: 401, message: 'Key is undefined or array' })
  }

  return await getSignedUrl(
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
