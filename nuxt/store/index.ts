import { decodeJwt, JWTPayload } from 'jose'
import { defineStore } from 'pinia'
import Plyr from 'plyr'
import { ref } from 'vue'

import type { Playlist, PlaylistItemMeta } from '~/types/playlist'

export const useStore = defineStore('creal', () => {
  const currentTrackDescription = ref<string>()
  const currentTrackMeta = ref<PlaylistItemMeta>()
  const currentTrackName = ref<string>()
  const currentTrackNameShort = ref<string>()
  const currentTrackPlaylistData = ref<Playlist>()
  const currentTrackPlaylistName = ref<string>()
  const isPlayerPaused = ref<boolean>()
  const isPlayerVisible = ref<boolean>(false)
  const jwt = ref<string>()
  const jwtDecoded = ref<JWTPayload>()
  const playerSourceInfo = ref<Plyr.SourceInfo>()
  const signedInUsername = ref<string>()

  function jwtRemove() {
    jwtSet(undefined)
  }

  function jwtSet(jwtNew?: string) {
    const jwtDecodedNew = jwtNew !== undefined ? decodeJwt(jwtNew) : undefined

    jwt.value = jwtNew
    jwtDecoded.value = jwtDecodedNew
    signedInUsername.value =
      jwtDecodedNew?.role === 'maevsi_account' &&
      jwtDecodedNew.exp !== undefined &&
      jwtDecodedNew.exp > Math.floor(Date.now() / 1000)
        ? (jwtDecodedNew.username as string | undefined)
        : undefined
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

  const setPlayerSourceInfo = (
    sourceInfo: Plyr.SourceInfo,
    isManuallySet: boolean
  ) => {
    if (!isPlayerPaused.value || isManuallySet) {
      playerSourceInfo.value = sourceInfo

      if (isPlayerPaused.value || isManuallySet) {
        isPlayerPaused.value = false
        // player.value.play()
      }
    }
  }

  return {
    currentTrackDescription,
    currentTrackMeta,
    currentTrackName,
    currentTrackNameShort,
    currentTrackPlaylistData,
    currentTrackPlaylistName,
    isPlayerPaused,
    isPlayerVisible,
    jwt,
    jwtDecoded,
    playerSourceInfo,
    signedInUsername,
    jwtRemove,
    jwtSet,
    setCurrentTrackName,
    setPlayerSourceInfo,
  }
})
