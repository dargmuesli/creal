import { URL } from 'node:url'
import { Readable } from 'node:stream'

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { defineEventHandler, H3Event } from 'h3'

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
    'https://example.org/'
  ).searchParams.get('key')

  if (!key) {
    throw createError({ statusCode: 401, message: 'Key missing!' })
  }

  const data = await s3.send(
    new GetObjectCommand({
      Bucket: config.public.s3Bucket,
      Key: key,
    })
  )

  if (!data) return

  return await streamToString(data.Body as Readable)
}

const streamToString = async (stream: Readable): Promise<string> =>
  await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  })
