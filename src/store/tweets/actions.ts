import types from "./types"
import type { RootState } from "@/store"
import type { TweetsState } from "./state"
import type { TweetsMutations } from "./mutations"
import type RaidTweet from "@/proto/raid_tweet"

export type TweetsActions<S = TweetsState, R = RootState> = {
	[types.UPDATE_TWEET](
		context: vuex.Context<S, types.UPDATE_TWEET, TweetsMutations, R>,
		payload: RaidTweet
	): void
}

const actions: TweetsActions = {
	[types.UPDATE_TWEET](context, payload) {
		context.commit(types.UPDATE_TWEET, payload)
	}
}

export default actions
