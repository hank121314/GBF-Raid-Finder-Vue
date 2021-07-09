import { createStore, useStore as baseUseStore } from "vuex"
import { InjectionKey } from "vue"
import BossesModule from "./bosses"
import ConfigsModule from "./configs"
import type { ConfigsActions, ConfigsState } from "./configs"
import type { BossesState, BossesActions } from "./bosses"

export type RootState = {
	bosses: BossesState
	configs: ConfigsState
}

export type Actions = BossesActions & ConfigsActions

// define injection key
export const key: InjectionKey<vuex.Store<RootState, Actions>> = Symbol()

export default createStore({
	modules: {
		bosses: BossesModule,
		configs: ConfigsModule
	}
})

export function useStore(): vuex.Store<RootState, Actions> {
	return baseUseStore(key) as vuex.Store<RootState, Actions>
}
