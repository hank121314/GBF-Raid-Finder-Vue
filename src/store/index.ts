import { createStore, useStore as baseUseStore } from "vuex"
import { InjectionKey } from "vue"
import createPersistedState from "vuex-persistedstate"
import BossesModule from "./bosses"
import ConfigsModule from "./configs"
import TweetsModule from "./tweets"
import type { ConfigsActions, ConfigsState } from "./configs"
import type { BossesState, BossesActions } from "./bosses"
import type { TweetsActions, TweetsState } from "./tweets"

export type RootState = {
	bosses: BossesState
	configs: ConfigsState
	tweets: TweetsState
}

export type Actions = BossesActions & ConfigsActions & TweetsActions

// define injection key
export const key: InjectionKey<vuex.Store<RootState, Actions>> = Symbol()

export default createStore({
	modules: {
		bosses: BossesModule,
		configs: ConfigsModule,
		tweets: TweetsModule
	},
	plugins: [createPersistedState({ paths: ["configs"] })]
})

export function useStore(): vuex.Store<RootState, Actions> {
	return baseUseStore(key) as vuex.Store<RootState, Actions>
}
