import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

import { PlaylistItemMeta } from '~/api/player/playlists'

@Module({
  name: 'modules/PlayerModule',
  namespaced: true,
  stateFactory: true,
})
export default class PlayerModule extends VuexModule {
  public currentTrackDescription: string | null = null
  public currentTrackMeta: PlaylistItemMeta | null = null
  public currentTrackName: string | null = null
  public currentTrackNameShort: string | null = null
  public currentTrackPlaylistName: string | null = null
  public isPlayerPaused: boolean | null = null
  public isPlayerVisible = false

  @Mutation
  public setCurrentTrackDescription(currentTrackDescription: string | null) {
    this.currentTrackDescription = currentTrackDescription
  }

  @Mutation
  public setCurrentTrackMeta(currentTrackMeta: PlaylistItemMeta | null) {
    this.currentTrackMeta = currentTrackMeta
  }

  @Mutation
  public setCurrentTrackName(currentTrackName: string | null) {
    this.currentTrackName = currentTrackName

    if (!currentTrackName) {
      this.currentTrackNameShort = null
      return
    }

    const currentTrackNameParts = currentTrackName.split(' - ')

    if (currentTrackNameParts.length === 2) {
      this.currentTrackNameShort = currentTrackNameParts[1]
    } else {
      this.currentTrackNameShort = null
    }
  }

  @Mutation
  public setCurrentTrackPlaylistName(currentTrackPlaylistName: string | null) {
    this.currentTrackPlaylistName = currentTrackPlaylistName
  }

  @Mutation
  public setIsPlayerPaused(isPlayerPaused: boolean | null) {
    this.isPlayerPaused = isPlayerPaused
  }

  @Mutation
  public setIsPlayerVisible(isPlayerVisible: boolean) {
    this.isPlayerVisible = isPlayerVisible
  }
}
