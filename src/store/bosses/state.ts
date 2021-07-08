import RaidBoss from "@/proto/raid_boss"

export type BossesState = {
	bosses: RaidBoss[]
}

const state: BossesState = {
	bosses: []
}

export default state
