import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

import { PlaylistItemMeta } from '~/api/player/playlists'

@Module({
  name: 'modules/PlayerModule',
  namespaced: true,
  stateFactory: true,
})
export default class PlayerModule extends VuexModule {
  public currentTrack: string | null = null
  public currentTrackDescription: string | null = null
  public isPlayerVisible = false
  public isPlayerPaused = false
  public meta: PlaylistItemMeta | null = null

  @Mutation
  public setCurrentTrack(currentTrack: string | null) {
    this.currentTrack = currentTrack
  }

  @Mutation
  public setCurrentTrackDescription(currentTrackDescription: string | null) {
    this.currentTrackDescription = currentTrackDescription
  }

  @Mutation
  public setIsPlayerVisible(isPlayerVisible: boolean) {
    this.isPlayerVisible = isPlayerVisible
  }

  @Mutation
  public setIsPlayerPaused(isPlayerPaused: boolean) {
    this.isPlayerPaused = isPlayerPaused
  }

  @Mutation
  public setMeta(meta: PlaylistItemMeta | null) {
    this.meta = meta
  }
}
