import RaidTweet from "@/proto/raid_tweet"

export type TweetsState = Record<string, RaidTweet[]>

const state: TweetsState = {}

export default state
