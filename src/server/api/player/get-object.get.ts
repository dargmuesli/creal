import { GetObjectCommand } from '@aws-sdk/client-s3'
import { parseURL, parseQuery } from 'ufo'

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  const proxy = useProxy()
  const getObject = useGetObject()

  if (runtimeConfig.public.vio.proxy) {
    return await proxy(getObject)
  }

  return await getObject()
})

const useGetObject = () => {
  const event = useEvent()
  const config = useRuntimeConfig()
  const { client: s3 } = useS3()

  const { req } = event.node
  const key = parseQuery(parseURL(req.url).search).key

  if (!key || Array.isArray(key)) {
    throw createError({
      statusCode: 400,
      message: 'Key is undefined or array',
    })
  }

  return async () => {
    const data = await s3.send(
      new GetObjectCommand({
        Bucket: config.public.creal.s3.bucket,
        Key: key,
      }),
    )

    if (!data.Body) return

    return await data.Body.transformToString()
  }
}
