<template>
	<div
		:id="tweetListId"
		class="inline-block relative pr-4"
		:style="{ width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }"
		:class="[{ 'overflow-hidden': !isMobile, 'overflow-y-auto': isMobile }, containerClass]"
	>
		<tweet-list-header
			:boss="boss"
			:show-boss-image="showBossImage"
			:notification="notification"
			@click-menu="onClickMenu"
			@click-music="onClickMusic"
		/>
		<tweet-list-item
			v-for="tweet in tweets"
			:key="tweet.tweet_id"
			:tweet="tweet"
			:show-user-image="showUserImage"
			:time-formation="timeFormation"
			@copied="onCopyTweet"
		/>
	</div>
	<tweet-list-slider v-model:list-width="width" @change-width="onChangeWidth" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from "vue"
import { nanoid } from "nanoid"
import PerfectScrollbar from "perfect-scrollbar"
import { isMobile } from "mobile-device-detect"
import { TweetListItem } from "@/components"
import Players from "@/services/players"
import { TimeFormation, ListConfiguration, SortPosition, Notifications, HeaderMenuItemName } from "@/configs"
import TweetListHeader from "./TweetListHeader.vue"
import TweetListSlider from "./TweetListSlider.vue"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"
import type { MenuItemProps } from "@/components/MenuList.vue"

export default defineComponent({
	name: "TweetList",
	components: { TweetListHeader, TweetListItem, TweetListSlider },
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
		listWidth: {
			type: Number,
			default: ListConfiguration.width
		},
		tweets: {
			type: Array as PropType<RaidTweet[]>,
			required: true
		}
	},
	emits: ["changeWidth", "clickPosition", "clear", "unfollow", "copied", "clickResetWidth", "clickMusic"],
	setup(props, { emit }) {
		const tweetListId = `tweet-list-${nanoid()}`
		const width = ref(props.listWidth)
		let ps: PerfectScrollbar | null = null

		onMounted(() => {
			if (!isMobile) {
				ps = new PerfectScrollbar(`#${tweetListId}`, {
					suppressScrollX: true
				})
			}
		})

		onUnmounted(() => {
			ps?.destroy()
			ps = null
		})

		watch(
			() => props.tweets.length,
			(newValue, oldValue) => {
				if (newValue - oldValue === 1) {
					Players.play(props.notification)
				}
				ps?.update()
			}
		)

		watch(
			() => props.listWidth,
			(newValue) => {
				width.value = newValue
			}
		)

		const onCopyTweet = (tweet: RaidTweet) => {
			emit("copied", tweet)
		}

		const onChangeWidth = () => {
			emit("changeWidth", { boss_name: props.boss.jp_name, width: width.value })
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
				case HeaderMenuItemName.RESET_WIDTH:
					emit("clickResetWidth", props.boss.jp_name)
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
			width,
			tweetListId,
			minWidth: ListConfiguration.minWidth,
			maxWidth: ListConfiguration.maxWidth,
			onCopyTweet,
			onChangeWidth,
			onClickMenu,
			onClickMusic,
			isMobile
		}
	}
})
</script>
