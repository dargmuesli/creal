import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { PlayerData } from '~/types/player'

export const useStore = defineStore('creal', () => {
  const playerData: PlayerData = {
    currentPlaylist: ref(),
    currentTrack: ref(),
    isPaused: ref(true),
    isVisible: ref(false),
    sourceInfo: ref(),
  }

  return {
    playerData,
  }
})
