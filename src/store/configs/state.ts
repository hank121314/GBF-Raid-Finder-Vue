import { TimeFormation, ListMode } from "@/configs"
import type { Language, Notifications } from "@/configs"

export type ConfigsState = {
	followed: string[]
	widths: Record<string, number>
	notifications: Record<string, Notifications>
	locale: Language
	showBossImage: boolean
	showUserImage: boolean
	timeFormation: TimeFormation
	mode: ListMode
}

const state: ConfigsState = {
	followed: [],
	widths: {},
	notifications: {},
	locale: navigator.language as Language,
	showBossImage: false,
	showUserImage: false,
	timeFormation: TimeFormation.Relative,
	mode: ListMode.TWEET
}

export default state
