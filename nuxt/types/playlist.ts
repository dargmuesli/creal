import mergeWith from 'lodash.mergewith'

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

export interface PlaylistExtended extends Playlist {
  collections: PlaylistExtended[]
  covers: string[]
  metas: string[]
}

export interface AxiosPlaylist {
  playlistData: Playlist
  nextContinuationToken?: string
}

function isObject(a: any) {
  return !!a && a.constructor === Object
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
