<template>
	<div
		class="inline-block overflow-y-auto"
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
		<DynamicScroller :items="tweets" :min-item-size="92" class="scroller z-0" key-field="tweet_id">
			<template #default="{ item: tweet, index, active }">
				<DynamicScrollerItem :item="tweet" :active="active" :size-dependencies="[tweet.tweet_id]" :data-index="index">
					<div
						class="px-2 py-2 bg-gray-700 my-2 rounded cursor-pointer"
						:class="`tweet-${tweet.tweet_id}`"
						data-clipboard-action="copy"
						:data-clipboard-target="`#raid-${tweet.tweet_id}`"
						@click="onClickTweet(`tweet-${tweet.tweet_id}`)"
					>
						<div class="flex items-center">
							<img
								v-if="showUserImage"
								:src="tweet.profile_image"
								class="rounded-full w-7 h-7 object-cover bg-cover"
								alt="profile_image"
							/>
							<p
								:id="`raid-${tweet.tweet_id}`"
								class="text-white text-base md:text-lg"
								:class="{ 'ml-2': showUserImage }"
							>
								{{ tweet.raid_id }}
							</p>
						</div>
						<p
							class="text-white text-sm md:text-base w-full py-2 px-2 bg-gray-600 rounded-md mt-2"
							:class="{ hidden: isEmpty(tweet.text) }"
						>
							{{ tweet.text }}
						</p>
						<div class="flex items-center justify-between mt-2">
							<p class="text-white text-xs text-left md:text-sm">
								{{ tweet.screen_name }}
							</p>
							<p class="w-full text-white text-xs text-right md:text-sm">
								{{ formatTime(tweet.created) }}
							</p>
						</div>
					</div>
				</DynamicScrollerItem>
			</template>
		</DynamicScroller>
	</div>
	<tweet-list-slider v-model:list-width="width" @change-width="onChangeWidth" />
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import dayjs from "dayjs"
import isEmpty from "lodash/isEmpty"
import Clipboard from "clipboard"
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller"
import globalI18n from "@/locales"
import Players from "@/services/players"
import { TimeFormation, ListConfiguration, SortPosition, Notifications, HeaderMenuItemName } from "@/configs"
import { infoToast } from "@/utils/alert"
import TweetListHeader from "./TweetListHeader.vue"
import TweetListSlider from "./TweetListSlider.vue"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"
import type { MenuItemProps } from "@/components/MenuList.vue"

export default defineComponent({
	name: "TweetList",
	components: { DynamicScroller, DynamicScrollerItem, TweetListHeader, TweetListSlider },
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
	emits: ["changeWidth", "clickPosition", "clear", "unfollow", "clickResetWidth", "clickMusic"],
	setup(props, { emit }) {
		const width = ref(props.listWidth)
		const i18n = useI18n()

		watch(
			() => props.tweets.length,
			(newValue, oldValue) => {
				if (newValue - oldValue === 1) {
					Players.play(props.notification)
				}
			}
		)

		watch(
			() => props.listWidth,
			(newValue) => {
				width.value = newValue
			}
		)

		const onClickTweet = (className: string) => {
			const clipboard = new Clipboard(`.${className}`)
			clipboard.on("success", function (e) {
				infoToast(i18n.t("messages.copySuccess"))
				e.clearSelection()
				clipboard.destroy()
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
