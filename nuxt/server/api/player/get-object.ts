import fs from 'fs'
import { ServerResponse, IncomingMessage } from 'http'
import { URL } from 'url'

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
    .then((data) => {
      if (!data) return
      res.end(data.Body)
    })
    .catch(() => {
      res.writeHead(500)
      res.end()
    })
}
