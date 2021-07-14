import axios, { AxiosInstance } from "axios"
import { baseURL } from "@/resources/settings"
import RaidBoss from "@/proto/raid_boss"
import RaidTweet from "@/proto/raid_tweet"

export type HttpClientInstance = {
	get_bosses(level: number): Promise<RaidBoss[]>
	get_persistence_boss(
		boss_names: string[]
	): Promise<Record<string, RaidTweet[]>>
}

class HttpClient implements HttpClientInstance {
	#innerClient: AxiosInstance

	constructor(baseURL: string) {
		this.#innerClient = axios.create({
			baseURL: "https://" + baseURL,
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
		const response = await this.#innerClient.post<Uint8Array[]>(
			"/get_bosses",
			params,
			config
		)
		const { data } = response
		return data.map((d) => new RaidBoss(d))
	}

	async get_persistence_boss(
		boss_names: string[]
	): Promise<Record<string, RaidTweet[]>> {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		}
		const params = {
			boss_names
		}
		const response = await this.#innerClient.post<Record<string, Uint8Array[]>>(
			"/get_persistence_boss",
			params,
			config
		)
		const { data } = response
		return Object.keys(data).reduce(
			(memo, key) => ({
				[key]: data[key].map((d) => new RaidTweet(d)),
				...memo
			}),
			{}
		)
	}
}

export default new HttpClient(baseURL)
