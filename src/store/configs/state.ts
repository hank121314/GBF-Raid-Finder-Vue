import { Language, TimeFormation } from "@/resources/settings"

export type ConfigsState = {
	followed: string[]
	locale: Language,
	showBossImage: boolean
	showUserImage: boolean
	timeFormation: TimeFormation
}

const state: ConfigsState = {
	followed: [],
	locale: navigator.language as Language,
	showBossImage: false,
	showUserImage: false,
	timeFormation: TimeFormation.Relative,
}

export default state
