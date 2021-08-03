import isEmpty from "lodash/isEmpty"
import isNil from "lodash/isNil"
import types from "./types"
import type { TweetsState } from "./state"
import type RaidTweet from "@/proto/raid_tweet"

export type TweetsMutations<S = TweetsState> = {
	[types.UPDATE_TWEET](state: S, payload: RaidTweet): void
	[types.COPIED_TWEET](state: S, payload: RaidTweet): void
	[types.FETCH_PERSISTENCE_TWEETS](state: S, payload: Record<string, RaidTweet[]>): void
	[types.CLEAR_TWEETS](state: S, payload: string): void
}

const mutations: TweetsMutations = {
	[types.UPDATE_TWEET](state, payload) {
		const { boss_name } = payload
		if (!boss_name) {
			return
		}
		if (!Array.isArray(state[boss_name])) {
			state[boss_name] = [payload]
		} else {
			state[boss_name].unshift(payload)
			if (state[boss_name].length > 100) {
				state[boss_name].pop()
			}
		}
	},
	[types.COPIED_TWEET](state, payload) {
		const { boss_name } = payload
		if (!boss_name) {
			return
		}
		if (isEmpty(state[boss_name] || isNil(state[boss_name]))) {
			return
		}
		const indices: number[] = []
		state[boss_name].forEach((tweet, index) => {
			if (tweet.raid_id === payload.raid_id) {
				indices.push(index)
			}
		})
		for (const index of indices) {
			if (state[boss_name] && state[boss_name][index]) state[boss_name][index].copied = true
		}
	},
	[types.FETCH_PERSISTENCE_TWEETS](state, payload) {
		Object.keys(payload).forEach((boss_name) => {
			if (!Array.isArray(state[boss_name])) {
				state[boss_name] = payload[boss_name]
			} else {
				state[boss_name].unshift(...payload[boss_name])
			}
		})
	},
	[types.CLEAR_TWEETS](state, payload) {
		state[payload] = []
	}
}

export default mutations
