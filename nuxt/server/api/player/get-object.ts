import fs from 'node:fs'
import { URL } from 'node:url'
import { Readable } from 'node:stream'

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const { req } = event.node
  const s3 = new S3Client({
    apiVersion: '2006-03-01',
    credentials: fromIni({
      filepath: '/run/secrets/creal_aws-credentials',
    }),
    endpoint: 'https://s3.nl-ams.scw.cloud',
    region: 'nl-ams',
  })

  const bucket = fs.readFileSync('/run/secrets/creal_aws-bucket', 'utf8')
  const key = new URL(
    req.url !== undefined ? req.url : '',
    'https://example.org/'
  ).searchParams.get('key')

  if (!key) {
    throw createError({ statusCode: 401, message: 'Key missing!' })
  }

  const data = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )

  if (!data) return

  return await streamToString(data.Body as Readable)
})

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  })
}
