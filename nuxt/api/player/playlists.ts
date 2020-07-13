import { ServerResponse, IncomingMessage } from 'http'
import { URL } from 'url'

import S3 from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'
import merge from 'lodash.mergewith'

function getNestedObject(properties: Array<string>, size: Number) {
  const nestedObject: any = {}

  if (properties.length < 2) {
    return undefined
  } else if (properties.length === 2) {
    if (properties[1].match(/^.+\.mp3$/)) {
      nestedObject[properties[0]] = { items: [{ name: properties[1], size }] }
    } else if (properties[1].match(/^.+\.(jpg|png)$/)) {
      nestedObject[properties[0]] = { cover: true }
    }
  } else {
    // properties.length is >2
    const key = properties[0]
    properties.shift()
    nestedObject[key] = { items: getNestedObject(properties, size) }
  }

  return nestedObject
}

export default {
  path: '/api/player/playlists',
  handler(req: IncomingMessage, res: ServerResponse) {
    const s3 = new S3({
      apiVersion: '2006-03-01',
      credentials: new AWS.SharedIniFileCredentials({
        filename: '/run/secrets/creal_aws-credentials',
      }),
      endpoint: 'https://s3.nl-ams.scw.cloud',
      region: 'nl-ams',
    })

    const bucket = 'creal-audio-dev'
    const urlSearchParams = new URL(
      req.url !== undefined ? req.url : '',
      'https://example.org/'
    ).searchParams
    const continuationToken = urlSearchParams.get('continuation-token')
    const prefix = urlSearchParams.get('prefix')

    s3.listObjectsV2(
      {
        ...{
          Bucket: bucket,
          // MaxKeys: 10,
        },
        ...(continuationToken !== null && {
          ContinuationToken: continuationToken,
        }),
        ...(prefix !== null && {
          Prefix: prefix,
        }),
      },
      function (err, data) {
        if (err) {
          res.writeHead(500)
          res.end(err.message)
          return
        }

        if (data.Contents === undefined) {
          res.writeHead(204)
          res.end('No content')
          return
        }

        const playlists = {}

        data.Contents.forEach((content) => {
          if (content.Key === undefined) {
            res.writeHead(500)
            res.end('Content key undefined')
            return
          }

          const keyParts = content.Key.split('/')

          if (keyParts[keyParts.length - 1] === '') {
            // no file
            return
          }

          const nestedObject = getNestedObject(
            keyParts,
            content.Size !== undefined ? content.Size : 0
          )

          merge(playlists, nestedObject, (objValue: any, srcValue: any) => {
            if (Array.isArray(objValue)) {
              return objValue.concat(srcValue)
            }
          })
        })

        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            playlists,
            ...(data.NextContinuationToken !== undefined && {
              nextContinuationToken: data.NextContinuationToken,
            }),
          })
        )
      }
    )
  },
}
