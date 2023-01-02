import fs from 'fs'
import { URL } from 'url'

import { defineEventHandler } from 'h3'

import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

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

  await s3.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    {
      expiresIn: 21600, // 6h
    }
  )

  return url
})
