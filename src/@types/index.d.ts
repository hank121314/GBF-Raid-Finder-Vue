import type {
	ActionContext,
	MutationTree,
	Store as VuexStore,
	DispatchOptions
} from "vuex"

declare global {
	namespace vuex {
		type Context<
			S,
			K extends string,
			M = MutationTree<S>,
			Root
		> = K extends keyof M
			? M[K] extends (...args: any) => any
				? { commit: (name: K, payload?: Parameters<M[K]>[1]) => ReturnType<A[K]> } & Omit<
						ActionContext<S, Root>,
						"commit"
				>
				: never
			: never

		type Store<S, A> = Omit<VuexStore<S>, "dispatch"> & {
			dispatch<K extends keyof A>(
				key: K,
				// make sure A[K] is a function so we can use Parameters<> to get its type.
				payload?: A[K] extends (...args: any) => any
					? Parameters<A[K]>[1]
					: any,
				options?: DispatchOptions
				// same as payload, we need to ensure A[K] is a function
			): A[K] extends (...args: any) => any ? ReturnType<A[K]> : any
		}
	}
}
