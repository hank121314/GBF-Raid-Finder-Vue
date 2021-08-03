<template>
	<div class="h-2 w-full sticky top-0 bg-background" />
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
			items-center
			justify-between
			bg-coolGray
			py-2
			mb-2
			object-cover
			rounded
			bg-full bg-top-1/5
			top-2
			sticky
		"
		@mousemove="onStartHoverHeader"
		@mouseleave="onEndHoverHeader"
	>
		<div class="flex h-full w-full justify-between px-2 items-center">
			<div class="flex flex-col justify-between overflow-hidden">
				<p class="text-white text-sm select-none whitespace-nowrap overflow-ellipsis md:text-base">
					{{ boss?.jp_name ?? $t("label.unknown") }}
				</p>
				<p class="text-white text-sm select-none whitespace-nowrap overflow-ellipsis md:text-base">
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
						<MenuIcon class="w-6 h-6 text-white transition duration-300" />
					</template>
				</menu-list>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "vue"
import { isMobile } from "mobile-device-detect"
import { useI18n } from "vue-i18n"
import isEmpty from "lodash/isEmpty"
import {
	MenuIcon,
	MinusIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	VolumeOffIcon,
	VolumeUpIcon,
	MenuAlt4Icon
} from "@heroicons/vue/solid"
import { BanIcon } from "@heroicons/vue/outline"
import Player from "@/services/players"
import { Notifications, HeaderMenuItemName } from "@/configs"
import { MenuRadio, MenuList } from "@/components"
import type { MenuItemProps } from "@/components/MenuList.vue"
import type RaidBoss from "@/proto/raid_boss"

export default defineComponent({
	name: "TweetListHeader",
	components: {
		MenuList,
		MenuRadio,
		MenuIcon,
		VolumeOffIcon,
		VolumeUpIcon
	},
	props: {
		boss: {
			type: Object as PropType<RaidBoss>,
			required: true
		},
		showBossImage: {
			type: Boolean,
			default: false
		},
		notification: {
			type: String,
			default: Notifications.NONE
		}
	},
	emits: ["clickMenu", "clickMusic"],
	setup(props, { emit }) {
		const i18n = useI18n()
		const hoverHeader = ref(false)
		const items = computed(() => [
			[
				{
					name: HeaderMenuItemName.CLEAR,
					label: i18n.t("label.clear"),
					icon: MinusIcon
				}
			],
			[{ name: HeaderMenuItemName.RESET_WIDTH, label: i18n.t("label.resetWidth"), icon: MenuAlt4Icon }],
			[
				{
					name: HeaderMenuItemName.MOVE_LEFT,
					label: i18n.t("label.moveLeft"),
					icon: ChevronLeftIcon
				},
				{
					name: HeaderMenuItemName.MOVE_RIGHT,
					label: i18n.t("label.moveRight"),
					icon: ChevronRightIcon
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

		const onClickMenu = (item: MenuItemProps) => {
			emit("clickMenu", item)
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

		return {
			hoverHeader,
			notificationItems,
			items,
			selectedAudio,
			onClickAudio,
			onClickMenu,
			onStartHoverHeader,
			onEndHoverHeader,
			isEmpty,
			isMobile,
			NotificationIcon
		}
	}
})
</script>
