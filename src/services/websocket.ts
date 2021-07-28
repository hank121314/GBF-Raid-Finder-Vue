import mitt, { Emitter } from "mitt"
import { WS_PATH, WS_PROTOCOL } from "@/resources/settings"
import RaidTweet from "@/proto/raid_tweet"

const KEEPALIVE = 5000

const PING = "__PING__"
const PONG = "__PONG__"

export enum WebsocketEvents {
	OPEN = "OPEN",
	CLOSE = "CLOSE",
	ERROR = "ERROR",
	MESSAGE = "MESSAGE"
}

export type Event = {
	kind: WebsocketEvents
	state?: number
	data?: RaidTweet
}

type Events = {
	event: Event
}

type onEvent = (e: Event) => void

export default class WebsocketClient {
	#baseURL: string
	#innerClient?: WebSocket | null
	#emitter: Emitter<Events>
	#lossPacket: number[]
	#keepAliveTimer?: number

	constructor(baseURL: string) {
		this.#baseURL = baseURL
		this.#emitter = mitt()
		this.#lossPacket = []
	}

	/**
	 * Connect to websocket server.
	 * if this.#innerClient is exist means it is already connected.
	 * Will start keepAlive once client is connected.
	 * And mapping the websocket events into mitt events.
	 * @returns {Promise<void>}
	 */
	async connect(): Promise<void> {
		if (this.#innerClient) return
		this.#innerClient = new WebSocket(WS_PROTOCOL + this.#baseURL + "/" + WS_PATH)
		this.#innerClient.binaryType = "arraybuffer"
		return new Promise<void>((resolve, reject) => {
			if (this.#innerClient) {
				this.#innerClient.onopen = () => {
					if (this.#innerClient?.readyState === WebSocket.OPEN) {
						this.onInnerConnect()
						this.keepAlive()
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
				this.#innerClient.onmessage = (e: MessageEvent<Uint8Array | string>) => {
					if (e.data === PONG) {
						this.#lossPacket.pop()
					} else {
						this.onInnerMessage(new Uint8Array(e.data as ArrayBufferLike))
					}
				}
			}
		})
	}

	/**
	 * Close websocket client and destroy the this.#innerClient instance
	 *
	 * Note: Since onclose timeout is a little bit longer, we do not wait until onclose is triggered
	 */
	async close(): Promise<void> {
		if (this.#innerClient) {
			this.#innerClient.close()
			// Unsubscribe the event listener
			this.#innerClient.onopen = null
			this.#innerClient.onmessage = null
			this.#innerClient.onclose = null
			this.#innerClient.onerror = null
		}
		// Destroy the instance
		this.#innerClient = null
		this.#lossPacket = []
		clearInterval(this.#keepAliveTimer)
	}

	/**
	 * Reconnect websocket client
	 * @returns {Promise<void>}
	 */
	async reconnect(): Promise<void> {
		return (
			this.close()
				.then(this.connect.bind(this))
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.catch(this.close.bind(this))
		)
	}

	keepAlive(): Promise<void> | void {
		// If this.#innerClient instance is undefined(null) call reconnect directly.
		if (!this.#innerClient)
			return this.reconnect().finally(() => {
				this.#keepAliveTimer = setTimeout(this.keepAlive.bind(this), KEEPALIVE)
			})
		// After sending PING packet add zero to this.#lossPacket.
		// this.#lossPacket will pop while receiving PONG packet.
		// If this.#lossPacket length is greater than one that means we sent one PING packets
		// with no PONG response(this.#lossPacket did not pop).
		// This situation indicate that the connection might be unstable.
		// So we will have to reconnect when this.#lossPacket is greater than one.
		this.#innerClient.send(PING)
		if (this.#lossPacket.length <= 1) {
			this.#lossPacket.push(0)
		} else {
			return this.reconnect().finally(() => {
				this.#keepAliveTimer = setTimeout(this.keepAlive.bind(this), KEEPALIVE)
			})
		}
		this.#keepAliveTimer = setTimeout(this.keepAlive.bind(this), KEEPALIVE)
	}

	/**
	 * Send the list of names to websocket server.
	 * @param {string[]} followed
	 */
	registerFollowBosses(followed: string[]): void {
		this.#innerClient?.send(JSON.stringify({ boss_names: followed }))
	}

	/**
	 * Subscribe the event from websocket client
	 * @param {onEvent} callback
	 */
	subscribeEvent(callback: onEvent): void {
		this.#emitter.on("event", callback)
	}

	onInnerConnect(): void {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.OPEN,
			state: this.#innerClient?.readyState
		})
	}

	onInnerClose(): void {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.CLOSE,
			state: this.#innerClient?.readyState
		})
	}

	onInnerMessage(input: Uint8Array): void {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.MESSAGE,
			state: this.#innerClient?.readyState,
			data: new RaidTweet(input)
		})
	}

	onInnerError(): void {
		this.#emitter.emit("event", {
			kind: WebsocketEvents.ERROR,
			state: this.#innerClient?.readyState
		})
	}
}
