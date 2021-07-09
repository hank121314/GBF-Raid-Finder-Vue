<template>
	<Dialog
		:open="isOpen"
		class="fixed w-full h-5/6 top-1/20 max-w-lg left-0 right-0 m-auto overflow-y-hidden"
		@close="onClose"
	>
		<dialog-overlay />
		<div
			class="flex w-full h-full max-w-9/10 bg-gray-800 rounded p-4 m-auto flex-col"
		>
			<tab v-model:selected="selected" :items="tabItems" />
			<div class="mt-2 grid grid-cols-3 items-center">
				<p class="text-white text-lg col-span-1 text-center">
					{{ `${$t("label.level")}` }}
				</p>
				<selector
					v-model:selectedItem="selectedLevel"
					class="col-span-2"
					:items="levels"
				/>
			</div>
			<div class="overflow-y-auto mt-2">
				<boss-tile
					v-for="boss in bossList"
					:key="boss.jp_name"
					:boss="boss"
					:show-boss-image="showBossImage"
					:followed="isFollowed(boss.jp_name)"
					@click="onPressBossTile(boss.jp_name)"
				/>
			</div>
		</div>
	</Dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue"
import { useI18n } from "vue-i18n"
import unionBy from "lodash/unionBy"
import isNil from "lodash/isNil"
import isEmpty from "lodash/isEmpty"
import filter from "lodash/filter"
import { Dialog, DialogOverlay } from "@headlessui/vue"
import { useStore } from "@/store"
import { Tab, Selector, BossTile } from "@/components"
import BossesTypes from "@/store/bosses/types"
import ConfigsTypes from '@/store/configs/types'

export default defineComponent({
	name: "Settings",
	components: {
		BossTile,
		Dialog,
		DialogOverlay,
		Tab,
		Selector
	},
	props: {
		isOpen: {
			type: Boolean
		}
	},
	emits: ["close"],
	setup(props, { emit }) {
		const store = useStore()
		const i18n = useI18n()
		const bosses = computed(() => store.state.bosses.bosses)
		const showBossImage = computed(() => store.state.configs.showBossImage)
		const followed = computed(() => store.state.configs.followed)
		const selected = ref(0)
		const tabItems = ref([
			{ label: i18n.t("label.follow") },
			{ label: i18n.t("label.settings") }
		])
		const selectedLevel = ref(0)
		const levels = computed(() =>
			[{ label: i18n.t("label.all"), level: 0 }].concat(
				filter(unionBy(bosses.value, (b) => b.level).map((b) => b.level ?? 0))
					.sort((a, b) => a - b)
					.map((b) => ({ label: `${b}`, level: b }))
			)
		)

		const bossList = computed(() => {
			const level = levels.value[selectedLevel.value]?.level ?? 0
			return level === 0
				? bosses.value
				: bosses.value.filter((b) => b.level === level)
		})

		const isFollowed = (bossJPName?: string): boolean => {
			if (isNil(bossJPName)) return false;
			return followed.value.includes(bossJPName);
		}

		const onPressBossTile = (bossJPName?: string) => {
			if (isNil(bossJPName)) return false
			store.dispatch(ConfigsTypes.TOGGLE_FOLLOWED, bossJPName)
		}

		const onClose = () => {
			emit("close")
		}

		watch(
			() => props.isOpen,
			async (newValue) => {
				// If user open settings and bosses list isEmpty, we should automatically fetch bosses info.
				if (newValue && isEmpty(store.state.bosses.bosses)) {
					await store.dispatch(BossesTypes.GET_BOSSES, 0)
				}
			}
		)

		return {
			bossList,
			showBossImage,
			selected,
			selectedLevel,
			tabItems,
			levels,
			isFollowed,
			onClose,
			onPressBossTile
		}
	}
})
</script>

<style scoped></style>
