import axios, { AxiosInstance } from "axios"
import settings from "@/resources/settings"
import RaidBoss from "@/proto/raid_boss"

export type HttpClientInstance = {
	get_bosses(level: number): Promise<RaidBoss[]>
}

class HttpClient implements HttpClientInstance {
	#base_url: string
	#inner_client: AxiosInstance

	constructor(base_url: string) {
		this.#base_url = base_url
		this.#inner_client = axios.create({
			baseURL: this.#base_url,
			responseType: "json"
		})
	}

	async get_bosses(level: number): Promise<RaidBoss[]> {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		}
		const params = {
			level
		}
		const response = await this.#inner_client.post<Uint8Array[]>(
			"/get_bosses",
			params,
			config
		)
		const { data } = response
		return data.map((d) => new RaidBoss(d))
	}
}

export default new HttpClient(settings.base_url)
