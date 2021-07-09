import { TimeFormation } from "@/resources/settings"

export type ConfigsState = {
	followed: string[]
	locale: string
	showBossImage: boolean
	showUserImage: boolean
	timeFormation: TimeFormation
}

const state: ConfigsState = {
	followed: [],
	locale: navigator.language,
	showBossImage: false,
	showUserImage: false,
	timeFormation: TimeFormation.Relative
}

export default state
