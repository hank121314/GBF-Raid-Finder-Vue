import { Language, TimeFormation } from "@/configs"

export type ConfigsState = {
	followed: string[]
	widths: Record<string, number>
	notifications: Record<string, string>,
	locale: Language
	showBossImage: boolean
	showUserImage: boolean
	timeFormation: TimeFormation
}

const state: ConfigsState = {
	followed: [],
	widths: {},
	notifications: {},
	locale: navigator.language as Language,
	showBossImage: false,
	showUserImage: false,
	timeFormation: TimeFormation.Relative
}

export default state
