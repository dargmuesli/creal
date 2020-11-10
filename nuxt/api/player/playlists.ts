import fs from 'fs'
import { ServerResponse, IncomingMessage } from 'http'
import { URL } from 'url'

import S3 from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'
import mergeWith from 'lodash.mergewith'

const consola = require('consola')

export const PLAYER_PREFIX = 'player/'

export interface PlaylistItem {
  name: string
  extension: string
  size: number
  active: boolean
  cover: boolean
  meta: boolean
}

export interface TrackListItem {
  startSeconds: number
  songName: string
  artistName: string
}

export interface PlaylistItemMeta {
  audioLength: number
  createdTime?: string
  description?: string
  mixcloudLink?: string
  tracklist?: TrackListItem[]
}

export interface Playlist {
  name: string
  collections: Playlist[]
  items: PlaylistItem[]
  cover: boolean
}

interface PlaylistExtended extends Playlist {
  collections: PlaylistExtended[]
  covers: string[]
  metas: string[]
}

export interface AxiosPlaylist {
  playlistData: Playlist
  nextContinuationToken?: string
}

function itemSort(a: PlaylistItem, b: PlaylistItem) {
  const aN = a.name
  const bN = b.name

  for (let i = 0; i < aN.length && i < bN.length; i++) {
    const charA = aN.charAt(i)
    const charB = bN.charAt(i)

    if (
      !isNaN(charA as any) &&
      !isNaN(parseFloat(charA)) &&
      !isNaN(charB as any) &&
      !isNaN(parseFloat(charB)) &&
      charA !== charB
    ) {
      return +charB - +charA
    }
  }

  return (aN as any) - (bN as any)
}

function isObject(a: any) {
  return !!a && a.constructor === Object
}

function getPlaylist(playlistDataExtended: PlaylistExtended): Playlist {
  // Set cover properties.
  for (let i = 0; i < playlistDataExtended.covers.length; i++) {
    // For collections.
    for (let j = 0; j < playlistDataExtended.collections.length; j++) {
      if (
        playlistDataExtended.covers[i] ===
        playlistDataExtended.collections[j].name
      ) {
        playlistDataExtended.collections[j].cover = true
        break
      }
    }

    // For items.
    for (let j = 0; j < playlistDataExtended.items.length; j++) {
      if (
        playlistDataExtended.covers[i] === playlistDataExtended.items[j].name
      ) {
        playlistDataExtended.items[j].cover = true
        break
      }
    }
  }

  // Set meta properties.
  for (let i = 0; i < playlistDataExtended.metas.length; i++) {
    // For items.
    for (let j = 0; j < playlistDataExtended.items.length; j++) {
      if (
        playlistDataExtended.metas[i] === playlistDataExtended.items[j].name
      ) {
        playlistDataExtended.items[j].meta = true
        break
      }
    }
  }

  const subCollections: Playlist[] = []

  for (let i = 0; i < playlistDataExtended.collections.length; i++) {
    subCollections.push(getPlaylist(playlistDataExtended.collections[i]))
  }

  // Leave out the helper properties `covers` and `metas`.
  return {
    name: playlistDataExtended.name,
    collections: subCollections,
    items: playlistDataExtended.items.sort(itemSort),
    cover: playlistDataExtended.cover,
  }
}

function getPlaylistExtended(
  pathParts: Array<string>,
  size: number,
  root: string = 'root'
): PlaylistExtended | undefined {
  const playlistDataExtended: PlaylistExtended = {
    name: root,
    collections: [],
    items: [],
    cover: false,
    covers: [],
    metas: [],
  }

  if (pathParts.length === 1) {
    // An item.
    const itemName = pathParts[0]

    if (size) {
      // A file.

      const match = itemName.match(/^(.+)\.(.+)$/)

      if (!match) {
        return undefined
      }

      const matchName = match[1]
      const matchEnding = match[2]

      switch (matchEnding) {
        case 'mp3':
          playlistDataExtended.items.push({
            name: matchName,
            extension: matchEnding,
            size,
            active: false,
            cover: false,
            meta: false,
          })
          break
        case 'jpg':
        case 'png':
          playlistDataExtended.covers.push(matchName)
          break
        case 'json':
          playlistDataExtended.metas.push(matchName)
          break
        default:
          consola.warn('Unexpected file type: ' + matchEnding)
      }
    } else {
      // A directory.
      playlistDataExtended.collections.push({
        name: itemName,
        collections: [],
        items: [],
        cover: false,
        covers: [],
        metas: [],
      })
    }
  } else if (pathParts.length > 1) {
    const name = pathParts[0]

    pathParts.shift()
    const playlistDataSub = getPlaylistExtended(pathParts, size, name)

    if (playlistDataSub) {
      playlistDataExtended.collections.push(playlistDataSub)
    } else {
      return undefined
    }
  }

  return playlistDataExtended
}

export function mergeByKey(target: any, source: any, key: string | number) {
  if (!key) {
    return
  }

  return mergeWith(target, source, (targetValue: any, srcValue: any) => {
    if (Array.isArray(targetValue) && Array.isArray(srcValue)) {
      let matchFound = false

      for (let j = 0; j < srcValue.length; j++) {
        for (let i = 0; i < targetValue.length; i++) {
          if (
            isObject(srcValue[j]) &&
            isObject(targetValue[i]) &&
            key in srcValue[j] &&
            key in targetValue[i] &&
            srcValue[j][key] === targetValue[i][key]
          ) {
            targetValue[i] = mergeByKey(targetValue[i], srcValue[j], key)
            matchFound = true
            break
          }
        }

        if (!matchFound) {
          targetValue.push(srcValue[j])
        } else {
          matchFound = false
        }
      }

      return targetValue
    } else {
      return undefined // Handle merge by lodash's merge function.
    }
  })
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
    const paramPrefix = urlSearchParams.get('prefix')
    const paramPrefixLength = paramPrefix ? paramPrefix.split('/').length : 0
    const paramPrefixLengthTotal = PLAYER_PREFIX_LENGTH + paramPrefixLength

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
        ...(paramPrefix !== null && {
          Prefix: PLAYER_PREFIX + paramPrefix + '/',
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

        const playlistDataExtended: PlaylistExtended = {
          name: paramPrefix || 'root',
          collections: [],
          items: [],
          cover: false,
          covers: [],
          metas: [],
        }

        // Iterate all subdirectories and files.
        data.Contents.forEach((content) => {
          // The content's key is the directory's/file's path.
          if (content.Key === undefined) {
            res.writeHead(500)
            res.end('Content key undefined')
            return
          }

          const keyParts = content.Key.split('/')

          // Normalize directories.
          if (keyParts[keyParts.length - 1] === '') {
            keyParts.pop()
          }

          if (
            ![paramPrefixLengthTotal + 1, paramPrefixLengthTotal + 2].includes(
              keyParts.length
            )
          ) {
            // Not an item on any requested level.
            return
          }

          keyParts.splice(0, paramPrefixLengthTotal)

          const nestedData = getPlaylistExtended(
            keyParts,
            content.Size !== undefined ? content.Size : 0
          )

          mergeByKey(playlistDataExtended, nestedData, 'name')
        })

        const playlistData = getPlaylist(playlistDataExtended)
        const result: AxiosPlaylist = {
          playlistData,
          ...(data.NextContinuationToken !== undefined && {
            nextContinuationToken: data.NextContinuationToken,
          }),
        }
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result))
      }
    )
  },
}
