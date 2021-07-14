import { Reader } from "protobufjs/minimal"
import { MAX_VALUE} from "long"

function longToNumber(long: Long): number {
	if (long.gt(MAX_VALUE)) {
		throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER")
	}
	return long.toNumber()
}

export default class RaidTweet {
	tweet_id?: number
	screen_name?: string
	boss_name?: string
	raid_id?: string
	text?: string
	created?: number
	language?: string
	profile_image?: string

	constructor(input: Uint8Array) {
		const reader = new Reader(input)
		const end = reader.len
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					this.tweet_id = longToNumber(reader.uint64() as Long)
					break
				case 2:
					this.screen_name = reader.string()
					break
				case 3:
					this.boss_name = reader.string()
					break
				case 4:
					this.raid_id = reader.string()
					break
				case 5:
					this.text = reader.string()
					break
				case 6:
					this.created = longToNumber(reader.uint64() as Long)
					break
				case 7:
					this.language = reader.string()
					break
				case 8:
					this.profile_image = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
	}
}
