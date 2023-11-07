import { URL } from 'node:url'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import type { H3Event } from 'h3'

import { getS3Client, proxy } from '~/server/utils/util'

export default defineEventHandler(async (event) => {
  return await proxy(event, getObject)
})

const getObject = async (event: H3Event) => {
  const { req } = event.node
  const config = useRuntimeConfig()

  const s3 = getS3Client()
  const key = new URL(
    req.url !== undefined ? req.url : '',
    'https://example.org/',
  ).searchParams.get('key')

  if (!key) {
    throw createError({ statusCode: 401, message: 'Key missing!' })
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
