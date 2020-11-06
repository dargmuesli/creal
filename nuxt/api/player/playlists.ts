import fs from 'fs'
import { ServerResponse, IncomingMessage } from 'http'
import { URL } from 'url'

import S3 from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'
import merge from 'lodash.mergewith'

export const PLAYER_PREFIX = 'player/'

function getNestedObject(pathParts: Array<string>, size: Number) {
  const nestedObject: any = {}

  if (pathParts.length < 2) {
    // A file, not a directory.
    return undefined
  } else if (pathParts.length === 2) {
    // The path's last directory.

    if (pathParts[1].match(/^.+\.mp3$/)) {
      nestedObject[pathParts[0]] = { items: [{ name: pathParts[1], size }] }
    } else if (pathParts[1].match(/^.+\.(jpg|png)$/)) {
      nestedObject[pathParts[0]] = { cover: true }
    }
  } else {
    // A directory with more to come (`pathParts.length` is >2).
    const key = pathParts[0]
    pathParts.shift()
    nestedObject[key] = { collections: getNestedObject(pathParts, size) }
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

    const PLAYER_PREFIX_LENGTH = PLAYER_PREFIX.split('/').length - 1
    const bucket = fs.readFileSync('/run/secrets/creal_aws-bucket', 'utf8')
    const urlSearchParams = new URL(
      req.url !== undefined ? req.url : '',
      'https://example.org/'
    ).searchParams
    const continuationToken = urlSearchParams.get('continuation-token')
    const prefix = urlSearchParams.get('prefix')
    const prefixLength = prefix ? prefix.split('/').length : 0
    const prefixLengthTotal = PLAYER_PREFIX_LENGTH + prefixLength

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjectsV2-property
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
          Prefix: PLAYER_PREFIX + prefix + '/',
        }),
      },
      function (err, data) {
        // On s3 api error.
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

        // Iterate all subdirectories and files.
        data.Contents.forEach((content) => {
          // The content's key is the directory's/file's path.
          if (content.Key === undefined) {
            res.writeHead(500)
            res.end('Content key undefined')
            return
          }

          const keyParts = content.Key.split('/')

          if (keyParts[keyParts.length - 1] === '') {
            keyParts.pop()
          }

          if (
            ![prefixLengthTotal + 1, prefixLengthTotal + 2].includes(
              keyParts.length
            )
          ) {
            // Not an item on any requested level.
            return
          }

          keyParts.splice(0, PLAYER_PREFIX_LENGTH)

          const nestedPlaylist = getNestedObject(
            keyParts,
            content.Size !== undefined ? content.Size : 0
          )

          merge(playlists, nestedPlaylist, (value: any, srcValue: any) => {
            if (Array.isArray(value)) {
              return value.concat(srcValue)
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
