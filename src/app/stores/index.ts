import { defineStore } from 'pinia'
import { ref } from 'vue'

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
