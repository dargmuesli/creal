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
