import fs from 'node:fs'
import { ServerResponse, IncomingMessage } from 'node:http'
import { URL } from 'node:url'
import { Readable } from 'node:stream'

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { fromIni } from '@aws-sdk/credential-providers'

export default function (req: IncomingMessage, res: ServerResponse) {
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

  s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
    .then(async (data) => {
      if (!data) return
      res.end(await streamToString(data.Body as Readable))
    })
    .catch(() => {
      res.writeHead(500)
      res.end()
    })
}

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
  })
}
