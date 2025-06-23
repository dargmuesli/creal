import { GetObjectCommand } from '@aws-sdk/client-s3'
import type { H3Event } from 'h3'
import { parseURL, parseQuery } from 'ufo'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  if (runtimeConfig.public.vio.proxy) {
    return await proxy(event, getObject)
  }

  return await getObject(event)
})

const getObject = async (event: H3Event) => {
  const { req } = event.node
  const config = useRuntimeConfig()

  const s3 = getS3Client()
  const key = parseQuery(parseURL(req.url).search).key

  if (!key || Array.isArray(key)) {
    throw createError({ statusCode: 401, message: 'Key is undefined or array' })
  }

  const data = await s3.send(
    new GetObjectCommand({
      Bucket: config.public.creal.s3.bucket,
      Key: key,
    }),
  )

  if (!data) return

  return await data.Body?.transformToString()
}
