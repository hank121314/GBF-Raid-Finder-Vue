import { Language, TimeFormation } from "@/resources/settings"

export type ConfigsState = {
	followed: string[]
	width: Record<string, number>
	notification: Record<string, string>,
	locale: Language
	showBossImage: boolean
	showUserImage: boolean
	timeFormation: TimeFormation
}

const state: ConfigsState = {
	followed: [],
	width: {},
	notification: {},
	locale: navigator.language as Language,
	showBossImage: false,
	showUserImage: false,
	timeFormation: TimeFormation.Relative
}

export default state
