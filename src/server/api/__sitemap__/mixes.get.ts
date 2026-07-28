import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import type { SitemapUrl } from '#sitemap/types'

import {
  getCollectionPath,
  getTrackPath,
} from '../../../app/utils/player-route'

const toSitemapUrl = (loc: string): SitemapUrl => ({
  loc,
  _encoded: true,
  _i18nTransform: true,
})

const listPlaylistLevel = async ({
  bucket,
  playlistPath,
}: {
  bucket: string
  playlistPath: string | undefined
}) => {
  const { client: s3 } = useS3()
  const prefix = PLAYER_PREFIX + (playlistPath ? `${playlistPath}/` : '')
  const collectionPaths: string[] = []
  const trackNames: string[] = []
  let continuationToken: string | undefined

  do {
    const data = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
        Delimiter: '/',
        Prefix: prefix,
      }),
    )

    for (const commonPrefix of data.CommonPrefixes ?? []) {
      const key = commonPrefix.Prefix

      if (!key) continue

      collectionPaths.push(key.slice(PLAYER_PREFIX.length, -1))
    }

    for (const content of data.Contents ?? []) {
      const key = content.Key

      if (!key) continue

      const match = key.slice(prefix.length).match(/^(.+)\.mp3$/)

      if (match?.[1]) trackNames.push(match[1])
    }

    continuationToken = data.NextContinuationToken
  } while (continuationToken)

  return { collectionPaths, trackNames }
}

const fetchMixSitemapUrls = async (): Promise<SitemapUrl[]> => {
  const bucket = useRuntimeConfig().public.creal.s3.bucket
  const urls = [toSitemapUrl(getCollectionPath())]
  const playlistPathQueue: (string | undefined)[] = [undefined]

  while (playlistPathQueue.length) {
    const playlistPath = playlistPathQueue.shift()
    const { collectionPaths, trackNames } = await listPlaylistLevel({
      bucket,
      playlistPath,
    })

    for (const collectionPath of collectionPaths) {
      urls.push(toSitemapUrl(getCollectionPath(collectionPath)))
      playlistPathQueue.push(collectionPath)
    }

    for (const trackName of trackNames) {
      urls.push(toSitemapUrl(getTrackPath(playlistPath, trackName)))
    }
  }

  return urls
}

// The S3 bucket is crawled recursively (one request per collection level),
// so this is cached independently of and longer than the sitemap module's
// own `cacheMaxAgeSeconds`. Mixes are added infrequently, and this avoids
// re-crawling the whole tree every time the sitemap cache itself expires.
export default defineCachedEventHandler(fetchMixSitemapUrls, {
  getKey: () => 'urls',
  maxAge: 60 * 60,
  name: 'sitemap-mixes',
})
