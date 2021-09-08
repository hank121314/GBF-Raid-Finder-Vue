<template>
	<div class="overflow-y-auto h-full">
		<p class="text-base font-sans text-white mt-2 ml-4 col-span-1 md:text-lg">
			{{ $t("label.listType") }}
		</p>
		<RadioButton v-model:selected="mode" :items="modeItems" class="mt-4" />
		<p class="text-base font-sans text-white mt-2 ml-4 col-span-1 md:text-lg">
			{{ $t("label.timeFormat") }}
		</p>
		<RadioButton v-model:selected="timeFormat" :items="timeFormatItems" class="mt-4" />
		<p class="text-base font-sans text-white mt-2 ml-4 col-span-1 md:text-lg">
			{{ $t("label.showBossImage") }}
		</p>
		<RadioButton v-model:selected="showBossImage" :items="showBossImageItems" class="mt-4" />
		<p class="text-base font-sans text-white mt-2 ml-4 col-span-1 md:text-lg">
			{{ $t("label.showUserImage") }}
		</p>
		<RadioButton v-model:selected="showUserImage" :items="showUserImageItems" class="mt-4" />
		<p class="text-base font-sans text-white mt-2 ml-4 col-span-1 md:text-lg">
			{{ $t("label.language") }}
		</p>
		<selector v-model:selected="locale" class="mt-4" :items="localeItems" />
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { Language, ListMode, TimeFormation } from "@/configs"
import { useStore } from "@/store"
import ConfigsTypes from "@/store/configs/types"
import { RadioButton, Selector } from "@/components"

export default defineComponent({
	components: { RadioButton, Selector },
	setup() {
		const store = useStore()
		const i18n = useI18n()
		const timeFormat = computed({
			get: () => store.state.configs.timeFormation,
			set: (newValue) => {
				store.dispatch(ConfigsTypes.SET_TIME_FORMATION, newValue)
			}
		})
		const timeFormatItems = computed(() => [
			{ label: i18n.t("timeFormat.relative"), value: TimeFormation.Relative },
			{
				label: i18n.t("timeFormat.twelveHour"),
				value: TimeFormation.TwelveHour
			},
			{
				label: i18n.t("timeFormat.twentyFourHour"),
				value: TimeFormation.TwentyFourHour
			}
		])

		const showBossImage = computed({
			get: () => store.state.configs.showBossImage,
			set: () => {
				store.dispatch(ConfigsTypes.TOGGLE_SHOW_BOSS_IMAGE)
			}
		})
		const showBossImageItems = computed(() => [
			{ label: i18n.t("label.on"), value: true },
			{ label: i18n.t("label.off"), value: false }
		])

		const showUserImage = computed({
			get: () => store.state.configs.showUserImage,
			set: () => {
				store.dispatch(ConfigsTypes.TOGGLE_SHOW_USER_IMAGE)
			}
		})
		const showUserImageItems = computed(() => [
			{ label: i18n.t("label.on"), value: true },
			{ label: i18n.t("label.off"), value: false }
		])

		const localeItems = ref([
			{ label: "繁體中文", value: Language.ZH_TW },
			{ label: "English", value: Language.EN }
		])
		const locale = computed({
			get: () => localeItems.value.findIndex((l) => l.value === store.state.configs.locale) ?? 0,
			set: (newValue) => {
				const selectedLocale = localeItems.value[newValue]?.value ?? Language.EN
				store.dispatch(ConfigsTypes.SET_LOCALE, selectedLocale)
			}
		})

		const modeItems = ref([
			{ label: i18n.t("label.tweetLists"), value: ListMode.TWEET },
			{ label: i18n.t("label.raidBossLists"), value: ListMode.BOSS }
		])
		const mode = computed({
			get: () => store.state.configs.mode,
			set: (newValue) => {
				store.dispatch(ConfigsTypes.SET_LIST_MODE, newValue)
			}
		})

		return {
			timeFormat,
			timeFormatItems,
			showBossImage,
			showBossImageItems,
			showUserImage,
			showUserImageItems,
			locale,
			localeItems,
			mode,
			modeItems
		}
	}
})
</script>
