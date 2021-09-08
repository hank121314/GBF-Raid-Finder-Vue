import types from "./types"
import type { ActionTree } from "vuex"
import type { RootState } from "@/store"
import type { Language, TimeFormation, SortPosition, Notifications, ListMode } from "@/configs"
import type { ConfigsState } from "./state"
import type { ConfigsMutations } from "./mutations"

export type ConfigsActions<S = ConfigsState, R = RootState> = {
	[types.TOGGLE_FOLLOWED](context: vuex.Context<S, types.TOGGLE_FOLLOWED, ConfigsMutations, R>, payload: string): void
	[types.SORT_FOLLOWED](
		context: vuex.Context<S, types.SORT_FOLLOWED, ConfigsMutations, R>,
		payload: { boss_name: string; position: SortPosition }
	): void
	[types.SET_WIDTH](
		context: vuex.Context<S, types.SET_WIDTH, ConfigsMutations, R>,
		payload: { boss_name: string; width: number }
	): void
	[types.RESET_WIDTH](
		context: vuex.Context<S, types.RESET_WIDTH, ConfigsMutations, R>,
		payload: string
	): void
	[types.SET_NOTIFICATION](
		context: vuex.Context<S, types.SET_NOTIFICATION, ConfigsMutations, R>,
		payload: { boss_name: string; notification: Notifications }
	): void
	[types.SET_LOCALE](context: vuex.Context<S, types.SET_LOCALE, ConfigsMutations, R>, payload: Language): void
	[types.TOGGLE_SHOW_BOSS_IMAGE](context: vuex.Context<S, types.TOGGLE_SHOW_BOSS_IMAGE, ConfigsMutations, R>): void
	[types.TOGGLE_SHOW_USER_IMAGE](context: vuex.Context<S, types.TOGGLE_SHOW_USER_IMAGE, ConfigsMutations, R>): void
	[types.SET_TIME_FORMATION](
		context: vuex.Context<S, types.SET_TIME_FORMATION, ConfigsMutations, R>,
		payload: TimeFormation
	): void
	[types.SET_LIST_MODE](
		context: vuex.Context<S, types.SET_LIST_MODE, ConfigsMutations, R>,
		payload: ListMode
	): void
} & ActionTree<S, R>

const actions: ConfigsActions = {
	[types.TOGGLE_FOLLOWED]({ commit }, payload) {
		commit(types.TOGGLE_FOLLOWED, payload)
	},
	[types.SORT_FOLLOWED]({ commit }, payload) {
		commit(types.SORT_FOLLOWED, payload)
	},
	[types.SET_WIDTH]({ commit }, payload) {
		commit(types.SET_WIDTH, payload)
	},
	[types.RESET_WIDTH]({ commit }, payload) {
		commit(types.RESET_WIDTH, payload)
	},
	[types.SET_NOTIFICATION]({ commit }, payload) {
		commit(types.SET_NOTIFICATION, payload)
	},
	[types.SET_LOCALE]({ commit }, payload) {
		commit(types.SET_LOCALE, payload)
	},
	[types.TOGGLE_SHOW_BOSS_IMAGE]({ commit }) {
		commit(types.TOGGLE_SHOW_BOSS_IMAGE)
	},
	[types.TOGGLE_SHOW_USER_IMAGE]({ commit }) {
		commit(types.TOGGLE_SHOW_USER_IMAGE)
	},
	[types.SET_TIME_FORMATION]({ commit }, payload) {
		commit(types.SET_TIME_FORMATION, payload)
	},
	[types.SET_LIST_MODE]({ commit }, payload) {
		commit(types.SET_LIST_MODE, payload)
	}
}

export default actions
