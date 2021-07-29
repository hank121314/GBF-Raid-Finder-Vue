import http from "@/services/http"
import isEmpty from 'lodash/isEmpty'
import types from "./types"
import type { RootState } from "@/store"
import type { TweetsState } from "./state"
import type { TweetsMutations } from "./mutations"
import type RaidTweet from "@/proto/raid_tweet"

export type TweetsActions<S = TweetsState, R = RootState> = {
	[types.UPDATE_TWEET](context: vuex.Context<S, types.UPDATE_TWEET, TweetsMutations, R>, payload: RaidTweet): void
	[types.FETCH_PERSISTENCE_TWEETS](
		context: vuex.Context<S, types.FETCH_PERSISTENCE_TWEETS, TweetsMutations, R>,
		payload: string[]
	): Promise<void>
	[types.CLEAR_TWEETS](context: vuex.Context<S, types.CLEAR_TWEETS, TweetsMutations, R>, payload: string): void
}

const actions: TweetsActions = {
	[types.UPDATE_TWEET]({ commit }, payload) {
		commit(types.UPDATE_TWEET, payload)
	},
	async [types.FETCH_PERSISTENCE_TWEETS]({ commit }, payload) {
		if (isEmpty(payload)) return
		const result = await http.get_persistence_boss(payload)
		commit(types.FETCH_PERSISTENCE_TWEETS, result)
	},
	[types.CLEAR_TWEETS]({ commit }, payload) {
		commit(types.CLEAR_TWEETS, payload)
	}
}

export default actions
