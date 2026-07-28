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

  // Leave out the helper properties `covers` and `metas`.
  return {
    name: playlistDataExtended.name,
    collections: playlistDataExtended.collections,
    items: playlistDataExtended.items.sort(itemSort),
    cover: playlistDataExtended.cover,
  }
}

const useFetchPlaylist = () => {
  const event = useEvent()
  const config = useRuntimeConfig()
  const { client: s3 } = useS3()

  const { req } = event.node
  const urlSearchParams = parseQuery(parseURL(req.url).search)

  const continuationToken = urlSearchParams['continuation-token']

  if (Array.isArray(continuationToken)) {
    throw createError({
      status: 400,
      statusText: 'Continuation token is an array',
    })
  }

  const paramPrefix = urlSearchParams.prefix

  if (Array.isArray(paramPrefix)) {
    throw createError({
      status: 400,
      statusText: 'Prefix is an array',
    })
  }

  // S3 has no "directories" — a collection is just every object key that
  // shares this prefix. Delimiter scopes the listing to the immediate
  // children only (CommonPrefixes = sub-collections, Contents = files),
  // instead of scanning the entire subtree and discarding what's too deep.
  const prefix = PLAYER_PREFIX + (paramPrefix ? `${paramPrefix}/` : '')

  return async () => {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: config.public.creal.s3.bucket,
        Delimiter: '/',
        Prefix: prefix,
        ...(continuationToken && {
          ContinuationToken: continuationToken,
        }),
      }),
    )

    if (!data) return

    if (!data.Contents?.length && !data.CommonPrefixes?.length) {
      return sendNoContent(event)
    }

    const playlistDataExtended: PlaylistExtended = {
      name: paramPrefix
        ? (paramPrefix.split('/').filter(Boolean).pop() ?? paramPrefix)
        : 'root',
      collections: [],
      items: [],
      cover: undefined,
      covers: [],
      metas: [],
    }

    for (const commonPrefix of data.CommonPrefixes ?? []) {
      const key = commonPrefix.Prefix

      if (!key) continue

      // Strip the queried prefix and the trailing delimiter to get the
      // immediate sub-collection's own name.
      const name = key.slice(prefix.length, -1)

      if (!name) continue

      playlistDataExtended.collections.push({
        name,
        collections: [],
        items: [],
        cover: undefined,
        covers: [],
        metas: [],
      })
    }

    for (const content of data.Contents ?? []) {
      const key = content.Key

      if (!key) {
        throw createError({ status: 500, statusText: 'Content key undefined' })
      }

      const leafName = key.slice(prefix.length)

      // Skip a zero-byte "folder marker" object sitting exactly at the
      // queried prefix (used to represent an intentionally empty
      // collection — S3 has no other way to express that).
      if (!leafName) continue

      const match = leafName.match(/^(.+)\.(.+)$/)

      if (!match?.[1] || !match?.[2]) continue

      const [, matchName, matchEnding] = match
      const size = content.Size || 0

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
