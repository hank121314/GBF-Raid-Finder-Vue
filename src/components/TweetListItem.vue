<template>
	<div
		class="px-2 py-2 bg-gray-700 my-4 rounded cursor-pointer z-0"
		:class="tweetClass"
		data-clipboard-action="copy"
		:data-clipboard-text="tweet.raid_id"
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
					class="text-white text-base font-sans md:text-lg"
					:class="{ 'ml-2': showUserImage, 'text-gray-500': tweet.copied }"
				>
					{{ tweet.raid_id }}
				</p>
			</div>
			<ClipboardCheckIcon v-if="tweet.copied" class="w-6 h-6 text-gray-500" />
		</div>
		<p
			class="text-white text-sm font-sans md:text-base w-full py-2 px-2 bg-gray-600 rounded-md mt-2"
			:class="{ hidden: isEmpty(tweet.text), 'text-gray-500': tweet.copied }"
		>
			{{ tweet.text }}
		</p>
		<div class="flex items-center justify-between mt-2">
			<p class="text-white text-xs text-left font-sans md:text-sm" :class="{ 'text-gray-500': tweet.copied }">
				{{ tweet.screen_name }}
			</p>
			<p class="w-full text-white text-xs text-right font-sans md:text-sm" :class="{ 'text-gray-500': tweet.copied }">
				{{ time }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, onUnmounted, watch } from "vue"
import { useI18n } from "vue-i18n"
import Clipboard from "clipboard"
import { ClipboardCheckIcon } from "@heroicons/vue/outline"
import { nanoid } from "nanoid"
import isEmpty from "lodash/isEmpty"
import globalI18n from "@/locales"
import { TimeFormation } from "@/configs"
import { infoToast } from "@/utils/alert"
import { useTime } from "@/utils/composables"
import type RaidTweet from "@/proto/raid_tweet"

export default defineComponent({
	name: "TweetListItem",
	components: { ClipboardCheckIcon },
	props: {
		tweet: {
			type: Object as PropType<RaidTweet>,
			required: true
		},
		showUserImage: {
			type: Boolean,
			default: true
		},
		timeFormation: {
			type: String as PropType<TimeFormation>,
			default: TimeFormation.Relative
		}
	},
	emits: ["copied"],
	setup(props, { emit }) {
		const i18n = useI18n()
		const tweetClass = `tweet-${nanoid()}`
		const { start, clear, time } = useTime(props.tweet.created, props.timeFormation)

		onMounted(() => {
			start()
		})
		onUnmounted(() => {
			clear()
		})

		watch(
			() => globalI18n.global.locale.value,
			() => {
				clear()
				start()
			}
		)

		const onClickTweet = (tweet: RaidTweet) => {
			const clipboard = new Clipboard(`.${tweetClass}`)
			clipboard.on("success", function (e) {
				infoToast(i18n.t("messages.copySuccess"))
				e.clearSelection()
				clipboard.destroy()
				emit("copied", tweet)
			})
		}

		return {
			tweetClass,
			onClickTweet,
			time,
			isEmpty
		}
	}
})
</script>
