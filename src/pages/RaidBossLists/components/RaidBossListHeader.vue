<template>
	<div
		:style="{
			backgroundImage:
				boss?.image && showBossImage
					? `linear-gradient(
								rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)
							),
								url(
									${boss?.image}
							)`
					: ``
		}"
		class="
			flex flex-col
			relative
			items-center
			justify-between
			bg-coolGray
			cursor-pointer
			px-2
			py-2
			object-cover
			rounded
			bg-full bg-top-1/5
			overflow-visible
		"
		:class="tweetCLass"
		data-clipboard-action="copy"
		:data-clipboard-text="tweet.raid_id"
		@click="onClickHeader(tweet)"
		@mousemove="onStartHoverHeader"
		@mouseleave="onEndHoverHeader"
	>
		<span v-if="!copied" class="absolute -top-1 -left-1 flex h-3 w-3 justify-center items-center">
			<span class="animate-ping absolute inline-flex w-4 h-4 rounded-full bg-blue-300 opacity-75" />
			<span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
		</span>
		<div class="flex h-full w-full justify-between items-center">
			<div class="flex flex-col justify-between overflow-hidden">
				<p
					class="
						text-white text-sm
						font-sans
						select-none
						whitespace-nowrap
						overflow-ellipsis overflow-hidden
						md:text-base
					"
					:class="{ 'text-gray-400': copied }"
				>
					{{ boss?.jp_name ?? $t("label.unknown") }}
				</p>
				<p
					class="
						text-white text-sm
						font-sans
						select-none
						whitespace-nowrap
						overflow-ellipsis overflow-hidden
						md:text-base
					"
					:class="{ 'text-gray-400': copied }"
				>
					{{ boss?.en_name ?? $t("label.unknown") }}
				</p>
			</div>
			<div class="flex items-center justify-between">
				<menu-radio :items="notificationItems" :selected="selectedAudio" @click="onClickAudio">
					<template #icon>
						<component
							:is="NotificationIcon"
							class="w-6 h-6 transition duration-300"
							:class="{
								'text-transparent': !hoverHeader && selectedAudio === 0,
								'text-white': hoverHeader || selectedAudio !== 0 || isMobile
							}"
						/>
					</template>
				</menu-radio>
				<menu-list :items="items" @click="onClickMenu">
					<template #icon>
						<MenuIcon
							class="w-6 h-6 transition duration-300"
							:class="{
								'text-transparent': !hoverHeader,
								'text-white': hoverHeader || isMobile
							}"
						/>
					</template>
				</menu-list>
				<DisclosureButton @click.stop>
					<button v-if="!open" class="flex items-center justify-center w-full h-6">
						<ChevronDoubleDownIcon
							class="w-6 h-6"
							:class="{
								'text-transparent': !hoverHeader,
								'text-white': hoverHeader || isMobile
							}"
						/>
					</button>
					<button v-if="open" class="flex items-center justify-center w-full h-6">
						<ChevronDoubleUpIcon
							class="w-6 h-6"
							:class="{
								'text-transparent': !hoverHeader,
								'text-white': hoverHeader || isMobile
							}"
						/>
					</button>
				</DisclosureButton>
			</div>
		</div>
		<div class="flex w-full items-center justify-between">
			<p
				class="
					text-white text-sm
					font-sans
					select-none
					whitespace-nowrap
					overflow-ellipsis overflow-hidden
					md:text-base
				"
				:class="{ 'text-gray-400': copied }"
			>
				{{ tweet.raid_id }}
			</p>
			<p
				class="
					text-white text-sm
					font-sans
					select-none
					whitespace-nowrap
					overflow-ellipsis overflow-hidden
					md:text-base
				"
				:class="{ 'text-gray-400': copied }"
			>
				{{ time }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch, onMounted, onUnmounted } from "vue"
import { isMobile } from "mobile-device-detect"
import { useI18n } from "vue-i18n"
import { nanoid } from "nanoid"
import isEmpty from "lodash/isEmpty"
import { DisclosureButton } from "@headlessui/vue"
import Clipboard from "clipboard"
import {
	MenuIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	ChevronDoubleUpIcon,
	ChevronDoubleDownIcon,
	VolumeOffIcon,
	VolumeUpIcon
} from "@heroicons/vue/solid"
import { BanIcon } from "@heroicons/vue/outline"
import Player from "@/services/players"
import { Notifications, HeaderMenuItemName, TimeFormation } from "@/configs"
import { MenuRadio, MenuList } from "@/components"
import { infoToast } from "@/utils/alert"
import { useTime } from "@/utils/composables"
import type { MenuItemProps } from "@/components/MenuList.vue"
import type RaidBoss from "@/proto/raid_boss"
import type RaidTweet from "@/proto/raid_tweet"

export default defineComponent({
	name: "RaidBossListHeader",
	components: {
		MenuList,
		MenuRadio,
		MenuIcon,
		VolumeOffIcon,
		VolumeUpIcon,
		ChevronDoubleUpIcon,
		ChevronDoubleDownIcon,
		DisclosureButton
	},
	props: {
		boss: {
			type: Object as PropType<RaidBoss>,
			required: true
		},
		tweet: {
			type: Object as PropType<RaidTweet>,
			required: true
		},
		showBossImage: {
			type: Boolean,
			default: false
		},
		open: {
			type: Boolean,
			default: false
		},
		notification: {
			type: String as PropType<Notifications>,
			default: Notifications.NONE
		},
		timeFormation: {
			type: String as PropType<TimeFormation>,
			default: TimeFormation.Relative
		}
	},
	emits: ["clickHeader", "clickMenu", "clickMusic"],
	setup(props, { emit }) {
		const i18n = useI18n()
		const tweetCLass = `tweet-header-${nanoid()}`
		const { start, clear, time } = useTime(props.tweet.created, props.timeFormation)

		onMounted(() => {
			start()
		})
		onUnmounted(() => {
			clear()
		})

		const hoverHeader = ref(false)
		const items = computed(() => [
			[
				{
					name: HeaderMenuItemName.MOVE_LEFT,
					label: i18n.t("label.moveUp"),
					icon: ChevronUpIcon
				},
				{
					name: HeaderMenuItemName.MOVE_RIGHT,
					label: i18n.t("label.moveDown"),
					icon: ChevronDownIcon
				}
			],
			[
				{
					name: HeaderMenuItemName.UNFOLLOW,
					label: i18n.t("label.unfollow"),
					icon: BanIcon
				}
			]
		])
		const notificationItems = computed(() => [
			{ name: Notifications.NONE, label: i18n.t("notifications.none") },
			{
				name: Notifications.BELL,
				label: i18n.t("notifications.bell")
			},
			{
				name: Notifications.XYLOPHONE,
				label: i18n.t("notifications.xylophone")
			}
		])

		const NotificationIcon = computed(() => (isEmpty(props.notification) ? VolumeOffIcon : VolumeUpIcon))
		const selectedAudio = computed(() => notificationItems.value.findIndex((n) => n.name === props.notification))
		const copied = computed(() => props.tweet.copied ?? true)

		const onClickMenu = (item: MenuItemProps) => {
			emit("clickMenu", item)
		}

		const onClickHeader = (tweet: RaidTweet) => {
			const clipboard = new Clipboard(`.${tweetCLass}`)
			clipboard.on("success", function (e) {
				infoToast(i18n.t("messages.copySuccess"))
				e.clearSelection()
				clipboard.destroy()
				emit("clickHeader", tweet)
			})
		}

		const onClickAudio = (index: number) => {
			const name = notificationItems.value[index].name
			Player.play(name)
			hoverHeader.value = false
			emit("clickMusic", name)
		}

		const onStartHoverHeader = () => {
			if (hoverHeader.value) return
			hoverHeader.value = true
		}

		const onEndHoverHeader = () => {
			if (!hoverHeader.value) return
			hoverHeader.value = false
		}

		watch(
			() => props.tweet.created,
			(newValue) => {
				if (!newValue) return
				start(newValue)
			}
		)

		watch(
			() => props.tweet.tweet_id,
			() => {
				Player.play(props.notification)
			}
		)

		return {
			tweetCLass,
			copied,
			hoverHeader,
			notificationItems,
			items,
			selectedAudio,
			onClickAudio,
			onClickMenu,
			onClickHeader,
			onStartHoverHeader,
			onEndHoverHeader,
			isMobile,
			NotificationIcon,
			time
		}
	}
})
</script>
