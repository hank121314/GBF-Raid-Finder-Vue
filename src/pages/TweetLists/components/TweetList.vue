<template>
	<div
		:id="tweetListId"
		class="inline-block overflow-hidden relative pr-4"
		:style="{ width: `${width}px`, minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }"
		:class="containerClass"
	>
		<tweet-list-header
			:boss="boss"
			:show-boss-image="showBossImage"
			:notification="notification"
			@click-menu="onClickMenu"
			@click-music="onClickMusic"
		/>
		<div v-for="tweet in tweets" :key="tweet.tweet_id" class="z-0">
			<div
				class="px-2 py-2 bg-gray-700 my-4 rounded cursor-pointer"
				:class="`tweet-${tweet.tweet_id}`"
				data-clipboard-action="copy"
				:data-clipboard-target="`#raid-${tweet.tweet_id}`"
				@click="onClickTweet(tweet)"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<img
							v-if="showUserImage"
							:src="tweet.profile_image"
							class="rounded-full w-7 h-7 object-cover bg-cover"
							alt="profile_image"
						>
						<p
							:id="`raid-${tweet.tweet_id}`"
							class="text-white text-base md:text-lg"
							:class="{ 'ml-2': showUserImage, 'text-gray-500': tweet.copied }"
						>
							{{ tweet.raid_id }}
						</p>
					</div>
					<ClipboardCheckIcon v-if="tweet.copied" class="w-6 h-6 text-gray-500" />
				</div>
				<p
					class="text-white text-sm md:text-base w-full py-2 px-2 bg-gray-600 rounded-md mt-2"
					:class="{ hidden: isEmpty(tweet.text), 'text-gray-500': tweet.copied }"
				>
					{{ tweet.text }}
				</p>
				<div class="flex items-center justify-between mt-2">
					<p class="text-white text-xs text-left md:text-sm" :class="{ 'text-gray-500': tweet.copied }">
						{{ tweet.screen_name }}
					</p>
					<p class="w-full text-white text-xs text-right md:text-sm" :class="{ 'text-gray-500': tweet.copied }">
						{{ formatTime(tweet.created) }}
					</p>
				</div>
			</div>
		</div>
	</div>
	<tweet-list-slider v-model:list-width="width" @change-width="onChangeWidth" />
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import dayjs from "dayjs"
import isEmpty from "lodash/isEmpty"
import Clipboard from "clipboard"
import PerfectScrollbar from "perfect-scrollbar"
import globalI18n from "@/locales"
import Players from "@/services/players"
import { TimeFormation, ListConfiguration, SortPosition, Notifications, HeaderMenuItemName } from "@/configs"
import { infoToast } from "@/utils/alert"
import { ClipboardCheckIcon } from "@heroicons/vue/outline"
import TweetListHeader from "./TweetListHeader.vue"
import TweetListSlider from "./TweetListSlider.vue"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"
import type { MenuItemProps } from "@/components/MenuList.vue"

export default defineComponent({
	name: "TweetList",
	components: { ClipboardCheckIcon, TweetListHeader, TweetListSlider },
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
		const tweetListId = "tweet-list"
		const width = ref(props.listWidth)
		const i18n = useI18n()
		let ps: PerfectScrollbar | null = null

		onMounted(() => {
			ps = new PerfectScrollbar(`#${tweetListId}`)
		})

		onUnmounted(() => {
			ps?.destroy()
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

		const onClickTweet = (tweet: RaidTweet) => {
			const clipboard = new Clipboard(`.tweet-${tweet.tweet_id}`)
			clipboard.on("success", function (e) {
				infoToast(i18n.t("messages.copySuccess"))
				e.clearSelection()
				clipboard.destroy()
				emit("copied", tweet)
			})
		}

		const formatTime = (created: number | undefined): string => {
			const date = dayjs(created).locale(globalI18n.global.locale.value.toLowerCase())
			switch (props.timeFormation) {
				case TimeFormation.Relative:
					return date.fromNow()
				case TimeFormation.TwelveHour:
					return date.format("YYYY-MM-DD hh:mm:ss a")
				case TimeFormation.TwentyFourHour:
					return date.format("YYYY-MM-DD HH:mm:ss")
			}
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
			formatTime,
			onClickTweet,
			onChangeWidth,
			onClickMenu,
			onClickMusic,
			isEmpty
		}
	}
})
</script>
