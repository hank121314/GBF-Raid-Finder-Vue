import http from "@/services/http"
import types from "./types"
import type { ActionTree } from "vuex"
import type { RootState } from "@/store"
import type { BossesState } from "./state"
import type { BossesMutations } from "./mutations"

export type BossesActions<S = BossesState, R = RootState> = {
	[types.GET_BOSSES](
		context: vuex.Context<S, types.GET_BOSSES, BossesMutations, R>,
		payload: number
	): Promise<void>
} & ActionTree<S, R>

const actions: BossesActions = {
	async [types.GET_BOSSES]({ commit }, payload) {
		const bosses = await http.get_bosses(payload)
		commit(types.GET_BOSSES, bosses)
	}
}

export default actions
