import Plyr from 'plyr'
import { Ref } from 'vue'

export interface PlaylistItem {
  fileExtension: string
  fileName: string
  fileSize: number
  isCoverAvailable: boolean
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
  isCoverAvailable: boolean
  items: PlaylistItem[]
  name: string
}

export interface PlaylistExtended extends Playlist {
  collections: PlaylistExtended[]
  covers: string[]
  metas: string[]
}

export interface FetchPlaylist {
  playlistData: Playlist
  nextContinuationToken?: string
}

export interface PlayerData {
  currentPlaylist: Ref<Playlist | undefined>
  currentTrack: Ref<PlaylistItem & { meta?: PlaylistItemMeta } | undefined>,
  isPaused: Ref<boolean>
  isVisible: Ref<boolean>
  sourceInfo: Ref<Plyr.SourceInfo | undefined>
}
