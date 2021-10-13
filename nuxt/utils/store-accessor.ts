import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import PlayerModule from '~/store/modules/PlayerModule'

// eslint-disable-next-line import/no-mutable-exports
let playerModule: PlayerModule

function initializeStores(store: Store<any>): void {
  playerModule = getModule(PlayerModule, store)
}

export { initializeStores, playerModule }
