import axios, { AxiosInstance } from "axios"
import { baseURL } from "@/resources/settings"
import RaidBoss from "@/proto/raid_boss"

export type HttpClientInstance = {
	get_bosses(level: number): Promise<RaidBoss[]>
}

class HttpClient implements HttpClientInstance {
	#baseURL: string
	#inner_client: AxiosInstance

	constructor(baseURL: string) {
		this.#baseURL = baseURL
		this.#inner_client = axios.create({
			baseURL: this.#baseURL,
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

export default new HttpClient(baseURL)
