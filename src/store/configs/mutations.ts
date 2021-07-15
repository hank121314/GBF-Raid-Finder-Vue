import xor from "lodash/xor"
import { SortPosition } from "@/configs"
import types from "./types"
import type { ConfigsState } from "./state"
import type { Language, TimeFormation } from "@/configs"

export type ConfigsMutations<S = ConfigsState> = {
	[types.TOGGLE_FOLLOWED](state: S, payload: string): void
	[types.SORT_FOLLOWED](
		state: S,
		payload: { boss_name: string; position: SortPosition }
	): void
	[types.SET_WIDTH](
		state: S,
		payload: { boss_name: string; width: number }
	): void
	[types.SET_NOTIFICATION](
		state: S,
		payload: { boss_name: string; notification: string }
	): void
	[types.SET_LOCALE](state: S, payload: Language): void
	[types.TOGGLE_SHOW_BOSS_IMAGE](state: S): void
	[types.TOGGLE_SHOW_USER_IMAGE](state: S): void
	[types.SET_TIME_FORMATION](state: S, payload: TimeFormation): void
}

const mutations: ConfigsMutations = {
	[types.TOGGLE_FOLLOWED](state, payload) {
		state.followed = xor(state.followed, [payload])
	},
	[types.SORT_FOLLOWED](state, payload) {
		const bossIndex = state.followed.findIndex(
			(str) => str === payload.boss_name
		)
		if (bossIndex === -1) {
			return
		}
		let nextIndex = 0
		if (payload.position === SortPosition.Left) {
			if (bossIndex === 0) {
				nextIndex = state.followed.length - 1
			} else {
				nextIndex = bossIndex - 1
			}
		} else if (payload.position === SortPosition.Right) {
			if (bossIndex === state.followed.length - 1) {
				nextIndex = 0
			} else {
				nextIndex = bossIndex + 1
			}
		}
		const temp = state.followed[bossIndex]
		state.followed[bossIndex] = state.followed[nextIndex]
		state.followed[nextIndex] = temp
	},
	[types.SET_WIDTH](state, payload) {
		state.widths[payload.boss_name] = payload.width
	},
	[types.SET_NOTIFICATION](state, payload) {
		state.notifications[payload.boss_name] = payload.notification
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
