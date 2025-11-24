import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { consola } from 'consola'
import { parseURL, parseQuery } from 'ufo'

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()
  const proxy = useProxy()
  const fetchPlaylist = useFetchPlaylist()

  if (runtimeConfig.public.vio.proxy) {
    return await proxy(fetchPlaylist)
  }

  return await fetchPlaylist()
})

const itemSort = (a: PlaylistItem, b: PlaylistItem) => {
  const aN = a.fileName
  const bN = b.fileName

  for (let i = 0; i < aN.length && i < bN.length; i++) {
    const charA = aN.charAt(i)
    const charB = bN.charAt(i)

    if (
      !isNaN(parseFloat(charA)) &&
      !isNaN(parseFloat(charB)) &&
      charA !== charB
    ) {
      return +charB - +charA
    }
  }

  return aN.length - bN.length
}

const getPlaylist = (playlistDataExtended: PlaylistExtended): Playlist => {
  // set cover properties
  for (const cover of playlistDataExtended.covers) {
    // for collections
    for (const collection of playlistDataExtended.collections) {
      if (cover.name === collection.name) {
        collection.cover = cover
        break
      }
    }

    // for items
    for (const playlistItem of playlistDataExtended.items) {
      if (cover.name === playlistItem.fileName) {
        playlistItem.cover = cover
        break
      }
    }
  }

  // set meta properties
  for (const playlistMeta of playlistDataExtended.metas) {
    // for items
    for (const playlistItem of playlistDataExtended.items) {
      if (playlistMeta === playlistItem.fileName) {
        playlistItem.isMetaAvailable = true
        break
      }
    }
  }

  const subCollections: Playlist[] = []

  for (const collection of playlistDataExtended.collections) {
    subCollections.push(getPlaylist(collection))
  }

  // Leave out the helper properties `covers` and `metas`.
  return {
    name: playlistDataExtended.name,
    collections: subCollections,
    items: playlistDataExtended.items.sort(itemSort),
    cover: playlistDataExtended.cover,
  }
}

const getPlaylistExtended = (
  pathParts: string[],
  size: number,
  root = 'root',
) => {
  const playlistDataExtended: PlaylistExtended = {
    name: root,
    collections: [],
    items: [],
    cover: undefined,
    covers: [],
    metas: [],
  }

  if (pathParts.length === 1) {
    // An item.
    const itemName = pathParts[0]

    if (!itemName) return

    if (size) {
      // A file.
      const match = itemName.match(/^(.+)\.(.+)$/)

      if (!match || !match[1] || !match[2]) {
        return undefined
      }

      const matchName = match[1]
      const matchEnding = match[2]

      switch (matchEnding) {
        case 'mp3':
          playlistDataExtended.items.push({
            fileName: matchName,
            fileExtension: matchEnding,
            fileSize: size,
            cover: undefined,
            isMetaAvailable: false,
          })
          break
        case 'jpg':
        case 'png':
        case 'webp':
          playlistDataExtended.covers.push({
            fileExtension: matchEnding,
            name: matchName,
          })
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
        cover: undefined,
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

const useFetchPlaylist = () => {
  const event = useEvent()
  const config = useRuntimeConfig()
  const { client: s3 } = useS3()

  const { req } = event.node

  const PLAYER_PREFIX_LENGTH = PLAYER_PREFIX.split('/').length - 1
  const urlSearchParams = parseQuery(parseURL(req.url).search)

  const continuationToken = urlSearchParams['continuation-token']

  if (Array.isArray(continuationToken)) {
    throw createError({
      statusCode: 400,
      message: 'Continuation token is an array',
    })
  }

  const paramPrefix = urlSearchParams.prefix

  if (Array.isArray(paramPrefix)) {
    throw createError({
      statusCode: 400,
      message: 'Prefix is an array',
    })
  }

  const paramPrefixLength = paramPrefix ? paramPrefix.split('/').length : 0
  const paramPrefixLengthTotal = PLAYER_PREFIX_LENGTH + paramPrefixLength

  return async () => {
    const data = await s3.send(
      new ListObjectsV2Command({
        ...{
          Bucket: config.public.creal.s3.bucket,
          // MaxKeys: 10,
        },
        ...(continuationToken && {
          ContinuationToken: continuationToken,
        }),
        ...(paramPrefix && {
          Prefix: PLAYER_PREFIX + paramPrefix + '/',
        }),
      }),
    )

    if (!data) return

    if (!data.Contents) {
      return sendNoContent(event)
    }

    const playlistDataExtended: PlaylistExtended = {
      name: paramPrefix || 'root',
      collections: [],
      items: [],
      cover: undefined,
      covers: [],
      metas: [],
    }

    // Iterate all subdirectories and files.
    for (const content of data.Contents) {
      // The content's key is the directory's/file's path.
      if (!content.Key) {
        throw createError({ statusCode: 500, message: 'Content key undefined' })
      }

      const keyParts = content.Key.split('/')

      // Normalize directories.
      if (keyParts[keyParts.length - 1] === '') {
        keyParts.pop()
      }

      if (
        ![paramPrefixLengthTotal + 1, paramPrefixLengthTotal + 2].includes(
          keyParts.length,
        )
      ) {
        // Not an item on any requested level.
        continue
      }

      keyParts.splice(0, paramPrefixLengthTotal)

      const nestedData = getPlaylistExtended(keyParts, content.Size || 0)

      mergeByKey(playlistDataExtended, nestedData, 'name')
    }

    const playlistData = getPlaylist(playlistDataExtended)
    const result: FetchPlaylist = {
      playlistData,
      ...(data.NextContinuationToken && {
        nextContinuationToken: data.NextContinuationToken,
      }),
    }

    return result
  }
}
