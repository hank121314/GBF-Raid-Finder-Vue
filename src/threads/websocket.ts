import WebsocketClient from "@/services/websocket"
import { BASE_URL } from "@/resources/settings"

const ws = new WebsocketClient(BASE_URL)

ws.subscribeEvent((ev) => {
	(self as DedicatedWorkerGlobalScope).postMessage(ev)
})

ws.connect()

onmessage = function (e: MessageEvent<string[]>) {
	ws.registerFollowBosses(e.data)
}
