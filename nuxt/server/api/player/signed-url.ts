import fs from 'fs'
import { ServerResponse, IncomingMessage } from 'http'
import { URL } from 'url'

import {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export default async function (req: IncomingMessage, res: ServerResponse) {
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
    res.writeHead(401)
    res.end('Key missing!')
    return
  }

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )
  } catch (err) {
    res.writeHead(500)
    res.end()
  }

  let url

  try {
    url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      {
        expiresIn: 21600, // 6h
      }
    )
  } catch (err: any) {
    res.writeHead(500)
    res.end(err.message)
  }

  res.setHeader('Content-Type', 'text/plain')
  res.end(url)
}
