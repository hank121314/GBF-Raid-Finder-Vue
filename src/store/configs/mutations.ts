import xor from 'lodash/xor'
import types from "./types"
import type { ConfigsState } from "./state"
import type { Language, TimeFormation } from "@/resources/settings"

export type ConfigsMutations<S = ConfigsState> = {
	[types.TOGGLE_FOLLOWED](state: S, payload: string): void
	[types.SET_LOCALE](state: S, payload: Language): void
	[types.TOGGLE_SHOW_BOSS_IMAGE](state: S): void
	[types.TOGGLE_SHOW_USER_IMAGE](state: S): void
	[types.SET_TIME_FORMATION](state: S, payload: TimeFormation): void
}

const mutations: ConfigsMutations = {
	[types.TOGGLE_FOLLOWED](state, payload) {
		state.followed = xor(state.followed, [payload])
	},
	[types.SET_LOCALE](state, payload) {
		state.locale = payload
	},
	[types.TOGGLE_SHOW_BOSS_IMAGE](state) {
		state.showBossImage = !state.showBossImage
	},
	[types.TOGGLE_SHOW_USER_IMAGE](state) {
		state.showUserImage = !state.showUserImage
	},
	[types.SET_TIME_FORMATION](state, payload) {
		state.timeFormation = payload
	}
}

export default mutations
