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
		state.bosses = payload.sort((a, b) => (a.level ?? 0) - (b?.level ?? 0))
	}
}

export default mutations
