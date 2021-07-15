import types from "./types"
import type { TweetsState } from "./state"
import type RaidTweet from "@/proto/raid_tweet"

export type TweetsMutations<S = TweetsState> = {
	[types.UPDATE_TWEET](state: S, payload: RaidTweet): void
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
		}
	},
	[types.CLEAR_TWEETS](state, payload) {
		state[payload] = []
	}
}

export default mutations
