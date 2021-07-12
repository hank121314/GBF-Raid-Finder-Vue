<template>
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
	<div v-if="loading" class="overflow-y-auto mt-2">
		<boss-tile
			v-for="index in Array.from({ length: 10 })"
			:key="`${index}`"
			:show-boss-image="showBossImage"
			:loading="loading"
		/>
	</div>
	<div v-if="!loading" class="overflow-y-auto mt-2">
		<boss-tile
			v-for="boss in bossList"
			:key="boss.jp_name"
			:boss="boss"
			:show-boss-image="showBossImage"
			:followed="isFollowed(boss.jp_name)"
			@click="onPressBossTile(boss.jp_name)"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import isNil from "lodash/isNil"
import filter from "lodash/filter"
import unionBy from "lodash/unionBy"
import { useStore } from "@/store"
import ConfigsTypes from "@/store/configs/types"
import { Selector, BossTile } from "@/components"

export default defineComponent({
	name: "BossList",
	components: { BossTile, Selector },
	props: {
		loading: {
			type: Boolean,
			default: false
		}
	},
	setup() {
		const store = useStore()
		const i18n = useI18n()
		const bosses = computed(() => store.state.bosses.bosses)
		const showBossImage = computed(() => store.state.configs.showBossImage)
		const followed = computed(() => store.state.configs.followed)

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
			if (isNil(bossJPName)) return false
			return followed.value.includes(bossJPName)
		}

		const onPressBossTile = (bossJPName?: string) => {
			if (isNil(bossJPName)) return false
			store.dispatch(ConfigsTypes.TOGGLE_FOLLOWED, bossJPName)
		}

		return {
			bossList,
			selectedLevel,
			levels,
			showBossImage,
			isFollowed,
			onPressBossTile
		}
	}
})
</script>
