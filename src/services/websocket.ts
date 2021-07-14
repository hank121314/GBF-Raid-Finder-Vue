import mitt, { Emitter } from "mitt"
import { baseURL, wsPath } from "@/resources/settings"
import RaidTweet from "@/proto/raid_tweet"

export enum WebsocketEvents {
	OPEN = "OPEN",
	CLOSE = "CLOSE",
	ERROR = "ERROR",
	MESSAGE = "MESSAGE"
}

type Event = {
	kind: WebsocketEvents
	state?: number
	data?: RaidTweet
}

type Events = {
	event: Event
}

type onEvent = (e: Event) => void

class WebsocketClient {
	#baseURL: string
	#innerClient?: WebSocket | null
	#emitter: Emitter<Events>
	#followed: string[]

	constructor(baseURL: string) {
		this.#baseURL = baseURL
		this.#emitter = mitt()
		this.#followed = []
	}

	async connect(): Promise<void> {
		this.#innerClient = new WebSocket("wss://" + this.#baseURL + "/" + wsPath)
		return new Promise<void>((resolve, reject) => {
			if (this.#innerClient) {
				this.#innerClient.onopen = () => {
					if (this.#innerClient?.readyState === 1) {
						this.onInnerConnect()
						resolve()
					}
				}
				this.#innerClient.onerror = (e) => {
					this.onInnerError()
					reject(e)
				}
			}
		}).then(() => {
			if (this.#innerClient) {
				this.#innerClient.onopen = () => {
					this.onInnerConnect()
				}
				this.#innerClient.onerror = () => {
					this.onInnerError()
				}
				this.#innerClient.onclose = () => {
					this.onInnerClose()
				}
				this.#innerClient.onmessage = async (e: MessageEvent<Blob>) => {
					const buffer = await e.data.arrayBuffer()
					this.onInnerMessage(new Uint8Array(buffer))
				}
			}
		})
	}

	async close(): Promise<void> {
		return new Promise((resolve) => {
			if (this.#innerClient) {
				this.#innerClient.onclose = () => {
					if (this.#innerClient?.readyState === WebSocket.CLOSED) {
						resolve()
					}
				}
				this.#innerClient.close()
				this.#innerClient = null
			}
		})
	}

	registerFollowBosses(followed: string[]) {
		this.#followed = followed
		this.#innerClient?.send(JSON.stringify({ boss_names: this.#followed }))
	}

	subscribeEvent(callback: onEvent) {
		this.#emitter.on("event", callback)
	}

	onInnerConnect() {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.OPEN,
			state: this.#innerClient?.readyState
		})
	}

	onInnerClose() {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.CLOSE,
			state: this.#innerClient?.readyState
		})
	}

	onInnerMessage(input: Uint8Array) {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.MESSAGE,
			state: this.#innerClient?.readyState,
			data: new RaidTweet(input)
		})
	}

	onInnerError() {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.ERROR,
			state: this.#innerClient?.readyState
		})
	}
}

export default new WebsocketClient(baseURL)
