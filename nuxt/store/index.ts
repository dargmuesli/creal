import { decodeJwt, JWTPayload } from 'jose'
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
  const jwt = ref<string>()
  const jwtDecoded = ref<JWTPayload>()
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

  return {
    jwt,
    jwtDecoded,
    playerData,
    signedInUsername,
    jwtRemove,
    jwtSet,
  }
})
