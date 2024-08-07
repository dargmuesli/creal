import type Plyr from 'plyr'
import type { Ref } from 'vue'

export interface Cover {
  fileExtension: 'jpg' | 'png' | 'webp'
  name: string
}

export interface PlaylistItem {
  cover?: Cover
  fileExtension: string
  fileName: string
  fileSize: number
  isMetaAvailable: boolean
}

export interface TrackListItem {
  artistName: string
  songName: string
  startSeconds: number
}

export interface PlaylistItemMeta {
  audioLength: number
  createdTime?: string
  description?: string
  mixcloudLink?: string
  tracklist?: TrackListItem[]
}

export interface Playlist {
  collections: Playlist[]
  cover?: Cover
  items: PlaylistItem[]
  name: string
}

export interface PlaylistExtended extends Playlist {
  collections: PlaylistExtended[]
  covers: Cover[]
  metas: string[]
}

export interface FetchPlaylist {
  playlistData: Playlist
  nextContinuationToken?: string
}

export interface PlayerData {
  currentPlaylist: Ref<Playlist | undefined>
  currentTrack: Ref<(PlaylistItem & { meta?: PlaylistItemMeta }) | undefined>
  isPaused: Ref<boolean>
  isVisible: Ref<boolean>
  sourceInfo: Ref<Plyr.SourceInfo | undefined>
}
