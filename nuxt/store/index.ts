// This file must exist for the i18n module too, as this file's existence enables the store.
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { PlaylistItemMeta } from '~/types/playlist'

export const useStore = defineStore('creal', () => {
  const currentTrackDescription = ref<string>()
  const currentTrackMeta = ref<PlaylistItemMeta>()
  const currentTrackName = ref<string>()
  const currentTrackNameShort = ref<string>()
  const currentTrackPlaylistName = ref<string>()
  const isPlayerPaused = ref<boolean>()
  const isPlayerVisible = ref<boolean>(false)

  function setCurrentTrackDescription(newCurrentTrackDescription?: string) {
    currentTrackDescription.value = newCurrentTrackDescription
  }

  function setCurrentTrackMeta(newCurrentTrackMeta?: PlaylistItemMeta) {
    currentTrackMeta.value = newCurrentTrackMeta
  }

  function setCurrentTrackName(newCurrentTrackName?: string) {
    currentTrackName.value = newCurrentTrackName

    if (!newCurrentTrackName) {
      currentTrackNameShort.value = undefined
      return
    }

    const currentTrackNameParts = newCurrentTrackName.split(' - ')

    if (currentTrackNameParts.length === 2) {
      currentTrackNameShort.value = currentTrackNameParts[1]
    } else {
      currentTrackNameShort.value = undefined
    }
  }

  function setCurrentTrackPlaylistName(newCurrentTrackPlaylistName?: string) {
    currentTrackPlaylistName.value = newCurrentTrackPlaylistName
  }

  function setIsPlayerPaused(newIsPlayerPaused?: boolean) {
    isPlayerPaused.value = newIsPlayerPaused
  }

  function setIsPlayerVisible(newIsPlayerVisible: boolean) {
    isPlayerVisible.value = newIsPlayerVisible
  }

  return {
    currentTrackDescription,
    currentTrackMeta,
    currentTrackName,
    currentTrackNameShort,
    currentTrackPlaylistName,
    isPlayerPaused,
    isPlayerVisible,
    setCurrentTrackDescription,
    setCurrentTrackMeta,
    setCurrentTrackName,
    setCurrentTrackPlaylistName,
    setIsPlayerPaused,
    setIsPlayerVisible,
  }
})
