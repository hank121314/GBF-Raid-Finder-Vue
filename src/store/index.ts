import { createStore, useStore as baseUseStore, Store as BaseStore } from "vuex"
import { InjectionKey } from "vue"
import { Merge } from "type-fest"
import BossesModule from "./bosses"
import type { BossesState, BossesActions } from "./bosses"

export type RootState = {
	bosses: BossesState
}

export type Actions = Merge<BossesActions, {}>

// define injection key
export const key: InjectionKey<vuex.Store<RootState, Actions>> = Symbol()

export default createStore({
	modules: {
		bosses: BossesModule
	}
})

export function useStore(): BaseStore<RootState> {
	return baseUseStore(key) as vuex.Store<RootState, Actions>
}
