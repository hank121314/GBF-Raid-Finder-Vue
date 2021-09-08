import { isMobile } from "mobile-device-detect"

export enum SettingsTab {
	BOSS_LIST = "BOSS_LIST",
	ENVIRONMENT = "ENVIRONMENT"
}

export enum HeaderMenuItemName {
	CLEAR = "CLEAR",
	MOVE_LEFT = "MOVE_LEFT",
	MOVE_RIGHT = "MOVE_RIGHT",
	RESET_WIDTH = "RESET_WIDTH",
	UNFOLLOW = "UNFOLLOW"
}

export enum TimeFormation {
	Relative = "relative",
	TwelveHour = "twelveHour",
	TwentyFourHour = "twentyFourHour"
}

export enum SortPosition {
	Left = "left",
	Right = "Right"
}

export enum Notifications {
	NONE = "",
	BELL = "BELL",
	XYLOPHONE = "XYLOPHONE"
}

export enum Language {
	EN = "en",
	ZH_TW = "zh-TW"
}

export enum ListMode {
	TWEET = "TWEET",
	BOSS = "BOSS",
}

export const ListConfiguration = {
	width: isMobile ? window.screen.width - 32 : 320,
	minWidth: 220,
	maxWidth: 440
}
