<template>
	<div class="grid grid-flow-col auto-cols-min w-full h-screen overflow-x-auto">
		<tweet-list
			v-for="(boss, index) in followedBosses"
			:key="boss.jp_name"
			:boss="boss"
			:show-boss-image="showBossImage"
			:show-user-image="showUserImage"
			:tweets="getTweets(boss.jp_name)"
			:list-width="getWidths(boss.jp_name)"
			:notification="getNotifications(boss.jp_name)"
			:time-formation="timeFormation"
			:container-class="{ 'ml-6': index === 0 }"
			@change-width="onChangeListWidth"
			@click-position="onClickPosition"
			@click-music="onClickMusic"
			@click-reset-width="onClickResetWidth"
			@copied="onCopiedTweet"
			@clear="onClearTweets"
			@unfollow="onClickUnfollow"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { useStore } from "@/store"
import { ListConfiguration, SortPosition, Notifications } from "@/configs"
import reject from "lodash/reject"
import isNil from "lodash/isNil"
import { TweetList } from "./components"
import TweetsTypes from "@/store/tweets/types"
import ConfigsTypes from "@/store/configs/types"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"

export default defineComponent({
	name: "TweetLists",
	components: { TweetList },
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
			return store.state.tweets[jpName] ?? []
		}
		const getWidths = (jpName: string | undefined) => {
			if (!jpName) return ListConfiguration.width
			return store.state.configs.widths[jpName] ?? ListConfiguration.width
		}
		const getNotifications = (jpName: string | undefined) => {
			if (!jpName) return Notifications.NONE
			return store.state.configs.notifications[jpName] ?? Notifications.NONE
		}

		const onChangeListWidth = (payload: { boss_name: string; width: number }) => {
			store.dispatch(ConfigsTypes.SET_WIDTH, payload)
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

		const onClickResetWidth = (boss_name: string) => {
			store.dispatch(ConfigsTypes.RESET_WIDTH, boss_name)
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
			getWidths,
			getTweets,
			getNotifications,
			onChangeListWidth,
			onClickPosition,
			onClearTweets,
			onClickResetWidth,
			onClickUnfollow,
			onClickMusic,
			onCopiedTweet
		}
	}
})
</script>
