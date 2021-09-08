<template>
	<collapsible class="my-2">
		<template #header="{ open }">
			<raid-boss-list-header
				:boss="boss"
				:tweet="latestTweet"
				:show-boss-image="showBossImage"
				:notification="notification"
				:time-formation="timeFormation"
				:open="open"
				@click-header="onClickHeader"
				@click-menu="onClickMenu"
				@click-music="onClickMusic"
			/>
		</template>
		<template #body>
			<tweet-list-item
				v-for="tweet in remaingTweets"
				:key="tweet.tweet_id"
				:tweet="tweet"
				:show-user-image="showUserImage"
				:time-formation="timeFormation"
				@copied="onCopyTweet"
			/>
		</template>
	</collapsible>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue"
import drop from "lodash/drop"
import head from "lodash/head"
import { TimeFormation, SortPosition, Notifications, HeaderMenuItemName } from "@/configs"
import { Collapsible, TweetListItem } from "@/components"
import RaidBossListHeader from "./RaidBossListHeader.vue"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"
import type { MenuItemProps } from "@/components/MenuList.vue"

export default defineComponent({
	name: "RaidBossList",
	components: { Collapsible, RaidBossListHeader, TweetListItem },
	props: {
		boss: {
			type: Object as PropType<RaidBoss>,
			required: true
		},
		containerClass: {
			type: Object,
			default: () => ({})
		},
		showBossImage: {
			type: Boolean,
			default: false
		},
		showUserImage: {
			type: Boolean,
			default: true
		},
		timeFormation: {
			type: String as PropType<TimeFormation>,
			default: TimeFormation.Relative
		},
		notification: {
			type: String as PropType<Notifications>,
			default: Notifications.NONE
		},
		tweets: {
			type: Array as PropType<RaidTweet[]>,
			required: true
		}
	},
	emits: ["clickPosition", "clear", "unfollow", "copied", "clickMusic"],
	setup(props, { emit }) {
		const latestTweet = computed(() => head(props.tweets) ?? {})
		const remaingTweets = computed(() => drop(props.tweets))

		const onClickHeader = (tweet: RaidTweet) => {
			emit("copied", tweet)
		}

		const onCopyTweet = (tweet: RaidTweet) => {
			emit("copied", tweet)
		}

		const onClickMenu = (item: MenuItemProps) => {
			switch (item.name) {
				case HeaderMenuItemName.MOVE_LEFT:
					emit("clickPosition", {
						boss_name: props.boss.jp_name,
						position: SortPosition.Left
					})
					break
				case HeaderMenuItemName.MOVE_RIGHT:
					emit("clickPosition", {
						boss_name: props.boss.jp_name,
						position: SortPosition.Right
					})
					break
				case HeaderMenuItemName.CLEAR:
					emit("clear", props.boss.jp_name)
					break
				case HeaderMenuItemName.UNFOLLOW:
					emit("unfollow", props.boss.jp_name)
					break
				default:
					break
			}
		}

		const onClickMusic = (notification: Notifications) => {
			emit("clickMusic", { boss_name: props.boss.jp_name, notification })
		}

		return {
			latestTweet,
			remaingTweets,
			onClickHeader,
			onCopyTweet,
			onClickMenu,
			onClickMusic
		}
	}
})
</script>
