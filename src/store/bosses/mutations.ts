import { PromiseValue } from "type-fest"
import types from "./types"
import type { HttpClientInstance } from "@/services/http"
import type { BossesState } from "./state"

export type BossesMutations<S = BossesState> = {
	[types.GET_BOSSES](
		state: S,
		payload: PromiseValue<ReturnType<HttpClientInstance["get_bosses"]>>
	): void
}

const mutations: BossesMutations = {
	[types.GET_BOSSES](state, payload) {
		state.bosses = payload
	}
}

export default mutations
