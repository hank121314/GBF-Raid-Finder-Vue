<template>
	<div class="flex flex-col w-full px-6 pt-4 pb-32 overflow-x-auto overflow-y-auto">
		<raid-boss-list
			v-for="boss in followedBosses"
			:key="boss.jp_name"
			:boss="boss"
			:show-boss-image="showBossImage"
			:show-user-image="showUserImage"
			:tweets="getTweets(boss.jp_name)"
			:notification="getNotifications(boss.jp_name)"
			:time-formation="timeFormation"
			@click-position="onClickPosition"
			@click-music="onClickMusic"
			@copied="onCopiedTweet"
			@clear="onClearTweets"
			@unfollow="onClickUnfollow"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useStore } from "@/store"
import { Notifications, SortPosition } from "@/configs"
import take from "lodash/take"
import reject from "lodash/reject"
import isNil from "lodash/isNil"
import TweetsTypes from "@/store/tweets/types"
import ConfigsTypes from "@/store/configs/types"
import { RaidBossList } from "./components"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"

export default defineComponent({
	components: { RaidBossList },
	setup() {
		const store = useStore()
		const showBossImage = computed(() => store.state.configs.showBossImage)
		const showUserImage = computed(() => store.state.configs.showUserImage)
		const timeFormation = computed(() => store.state.configs.timeFormation)
		const followedBosses = computed(
			() =>
				reject(
					store.state.configs.followed.map((name) => store.state.bosses.bosses.find((b) => b.jp_name === name)),
					isNil
				) as RaidBoss[]
		)

		const getTweets = (jpName: string | undefined) => {
			if (!jpName) return []
			return take(store.state.tweets[jpName] ?? [], 5)
		}
		const getNotifications = (jpName: string | undefined) => {
			if (!jpName) return Notifications.NONE
			return store.state.configs.notifications[jpName] ?? Notifications.NONE
		}

		const onClickPosition = (payload: { boss_name: string; position: SortPosition }) => {
			store.dispatch(ConfigsTypes.SORT_FOLLOWED, payload)
		}
		const onClearTweets = (boss_name: string) => {
			store.dispatch(TweetsTypes.CLEAR_TWEETS, boss_name)
		}
		const onClickUnfollow = (boss_name: string) => {
			store.dispatch(ConfigsTypes.TOGGLE_FOLLOWED, boss_name)
		}
		const onCopiedTweet = (tweet: RaidTweet) => {
			store.dispatch(TweetsTypes.COPIED_TWEET, tweet)
		}
		const onClickMusic = (payload: { boss_name: string; notification: Notifications }) => {
			store.dispatch(ConfigsTypes.SET_NOTIFICATION, payload)
		}

		return {
			followedBosses,
			showBossImage,
			showUserImage,
			timeFormation,
			getTweets,
			getNotifications,
			onClickPosition,
			onClearTweets,
			onClickUnfollow,
			onClickMusic,
			onCopiedTweet
		}
	}
})
</script>
