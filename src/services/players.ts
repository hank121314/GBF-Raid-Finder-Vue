import { Player as TonePlayer, loaded } from "tone"
import { Notifications } from "@/configs"
import BellMp3 from "@/assets/notifications/bell.mp3"
import XylophoneMp3 from "@/assets/notifications/xylophone.mp3"

class Players {
	#innerPlayers: Map<Notifications, TonePlayer>
	#resources: Record<Notifications, string>

	constructor(resources: Record<Notifications, string>) {
		this.#resources = resources
		this.#innerPlayers = new Map()
	}

	async load(): Promise<void> {
		(Object.keys(this.#resources) as Notifications[]).forEach((key) => {
			if (key === Notifications.NONE) return
			this.#innerPlayers.set(key, new TonePlayer(this.#resources[key]).toDestination())
		})
		await loaded()
	}

	play(name: Notifications) {
		if (this.#innerPlayers?.has(name)) {
			const player = this.#innerPlayers?.get(name)
			if (player?.loaded) {
				player?.start()
			}
		}
	}
}

const playerResources: Record<Notifications, string> = {
	[Notifications.NONE]: "",
	[Notifications.BELL]: BellMp3,
	[Notifications.XYLOPHONE]: XylophoneMp3
}

export default new Players(playerResources)
