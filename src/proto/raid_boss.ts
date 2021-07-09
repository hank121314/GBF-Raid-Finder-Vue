import { Reader } from "protobufjs/minimal"

export default class RaidBoss {
	en_name?: string
	jp_name?: string
	level?: number
	image?: string

	constructor(input: Uint8Array) {
		const reader = new Reader(input)
		const end = reader.len
		while (reader.pos < end) {
			const tag = reader.uint32()
			switch (tag >>> 3) {
				case 1:
					this.en_name = reader.string().replace(/&amp;/g, "&")
					break
				case 2:
					this.jp_name = reader.string()
					break
				case 3:
					this.level = reader.int32()
					break
				case 4:
					this.image = reader.string()
					break
				default:
					reader.skipType(tag & 7)
					break
			}
		}
	}
}
