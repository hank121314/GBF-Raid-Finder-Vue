import dayjs from "dayjs"
import "dayjs/locale/zh-tw"
import relativeTime from "dayjs/plugin/relativeTime"
import updateLocale from "dayjs/plugin/updateLocale"

dayjs.extend(updateLocale)

const thresholds = [
	{ l: "s", r: 30, d: "second" },
	{ l: "ss", r: 59, d: "second" },
	{ l: "m", r: 1 },
	{ l: "mm", r: 59, d: "minute" },
	{ l: "h", r: 1 },
	{ l: "hh", r: 23, d: "hour" },
	{ l: "d", r: 1 },
	{ l: "dd", r: 29, d: "day" },
	{ l: "M", r: 1 },
	{ l: "MM", r: 11, d: "month" },
	{ l: "y" },
	{ l: "yy", d: "year" }
]

dayjs.extend(relativeTime, { thresholds })

dayjs.updateLocale("en", {
	relativeTime: {
		future: "in %s",
		past: "%s",
		s: "Now",
		ss: "30 seconds ago",
		m: "a minute ago",
		mm: "%d minutes ago",
		h: "an hour ago",
		hh: "%d hours ago",
		d: "a day ago",
		dd: "%d days ago",
		M: "a month ago",
		MM: "%d months ago",
		y: "a year ago",
		yy: "%d years ago"
	}
})

dayjs.updateLocale("zh-tw", {
	relativeTime: {
		future: '%s內',
    past: '%s',
    s: '現在',
		ss: '30 秒前',
    m: '1 分鐘前',
    mm: '%d 分鐘前',
    h: '1 小時前',
    hh: '%d 小時前',
    d: '1 天前',
    dd: '%d 天前',
    M: '1 個月前',
    MM: '%d 個月前',
    y: '1 年前',
    yy: '%d 年前'
	}
})