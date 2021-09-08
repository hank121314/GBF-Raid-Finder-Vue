import { computed, getCurrentInstance, WritableComputedRef, ref, Ref } from "vue"
import isNil from "lodash/isNil"
import dayjs from "dayjs"
import { TimeFormation } from "@/configs"
import { formatTime } from "@/utils/chrono"

interface TimeComposable {
	time: Ref<string>
	clear(): void
	start(currentTimestamp?: number): void
}

export function useTime(timestamp: number | undefined, timeFormation: TimeFormation): TimeComposable {
	const time = isNil(timestamp) ? ref("- - -") : ref(formatTime(timestamp, timeFormation))
	let timer: number | undefined

	const clear = () => {
		if (isNil(timer)) return
		clearTimeout(timer)
		timer = undefined
	}

	const start = (currentTimestamp = timestamp) => {
		clear()
		time.value = formatTime(currentTimestamp, timeFormation)
		const next = dayjs(currentTimestamp)
		const now = dayjs()
		const relative = now.diff(next)
		let interval: number
		if (relative <= 30000) {
			interval = Math.abs(30000 - relative)
		} else {
			interval =  Math.abs(60000 - (relative % 60000))
		}
		interval += 1000
		timer = setTimeout(() => {
			time.value = formatTime(currentTimestamp, timeFormation)
			start(currentTimestamp)
		}, interval)
	}

	return {
		time,
		start,
		clear
	}
}

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
