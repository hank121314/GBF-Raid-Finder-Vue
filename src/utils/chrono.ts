import dayjs from "dayjs"
import globalI18n from "@/locales"
import { TimeFormation } from "@/configs"

export const formatTime = (created: number | undefined, timeFormation: TimeFormation): string => {
	const date = dayjs(created).locale(globalI18n.global.locale.value.toLowerCase())
	switch (timeFormation) {
		case TimeFormation.Relative:
			return date.fromNow()
		case TimeFormation.TwelveHour:
			return date.format("YYYY-MM-DD hh:mm:ss a")
		case TimeFormation.TwentyFourHour:
			return date.format("YYYY-MM-DD HH:mm:ss")
	}
}
