import { computed, getCurrentInstance, WritableComputedRef } from "vue"

export function useVModel<P extends Record<string, any>, K extends keyof P>(
	props: P,
	propName: K
): WritableComputedRef<P[K]> {
	const vm = getCurrentInstance()?.proxy

	return computed({
		get() {
			return props[propName]
		},
		set(value) {
			vm?.$emit(`update:${propName}`, value)
		}
	})
}
