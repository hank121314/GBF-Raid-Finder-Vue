import { isMobile } from "mobile-device-detect"

export enum TimeFormation {
	Relative = "relative",
	TwelveHour = "twelveHour",
	TwentyFourHour = "twentyFourHour"
}

export enum SortPosition {
	Left = "left",
	Right = "Right"
}

export enum Language {
	EN = "en",
	ZH_TW = "zh-TW"
}

export const ListConfiguration = {
	width: isMobile ? window.screen.width - 48 : 320,
	minWidth: 320,
	maxWidth: 440
}
