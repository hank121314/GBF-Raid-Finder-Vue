<template>
	<div class="mt-2 grid grid-cols-3 items-center">
		<p class="text-white text-base md:text-lg col-span-1 text-center">
			{{ `${$t("label.level")}` }}
		</p>
		<selector v-model:selected="selectedLevel" class="col-span-2" :items="levels" />
	</div>
	<!-- Render 10 empty boss tiles for loading -->
	<div v-if="loading" class="overflow-y-auto mt-2">
		<boss-tile
			v-for="index in Array.from({ length: 10 })"
			:key="`${index}`"
			:show-boss-image="showBossImage"
			:loading="loading"
		/>
	</div>
	<div v-if="!loading" class="overflow-y-auto mt-2 h-5/6">
		<boss-tile
			v-for="boss in bossList"
			:key="boss.jp_name"
			:boss="boss"
			:show-boss-image="showBossImage"
			:followed="isFollowed(boss.jp_name)"
			@click="onPressBossTile(boss.jp_name)"
		/>
	</div>
	<button
		v-wave="{ color: '#3B82F6' }"
		aria-label="refresh-list"
		class="
			rounded
			bg-blue-500
			flex
			self-end
			justify-center
			items-center
			mt-2
			py-3
			px-4
			hover:bg-blue-400
			focus:outline-none
		"
		@click="onFetchList"
	>
		<RefreshIcon class="text-white w-5 h-5 md:w-6 md:h-6" />
		<p class="text-sm md:text-base text-white ml-2">
			{{ $t("label.refresh") }}
		</p>
	</button>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue"
import { useI18n } from "vue-i18n"
import isEmpty from "lodash/isEmpty"
import isNil from "lodash/isNil"
import filter from "lodash/filter"
import unionBy from "lodash/unionBy"
import { useStore } from "@/store"
import BossesTypes from "@/store/bosses/types"
import ConfigsTypes from "@/store/configs/types"
import { Selector, BossTile } from "@/components"
import { RefreshIcon } from "@heroicons/vue/solid"
import { failToast } from "@/utils/alert"

export default defineComponent({
	name: "BossList",
	components: { BossTile, Selector, RefreshIcon },
	setup() {
		const store = useStore()
		const i18n = useI18n()
		const bosses = computed(() => store.state.bosses.bosses)
		const showBossImage = computed(() => store.state.configs.showBossImage)
		const followed = computed(() => store.state.configs.followed)
		const loading = ref(false)
		onMounted(async () => {
			if (isEmpty(store.state.bosses.bosses)) {
				await onFetchList()
			}
		})

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
			return level === 0 ? bosses.value : bosses.value.filter((b) => b.level === level)
		})

		const isFollowed = (bossJPName?: string): boolean => {
			if (isNil(bossJPName)) return false
			return followed.value.includes(bossJPName)
		}

		const onPressBossTile = (bossJPName?: string) => {
			if (isNil(bossJPName)) return false
			store.dispatch(ConfigsTypes.TOGGLE_FOLLOWED, bossJPName)
		}

		const onFetchList = async () => {
			loading.value = true
			try {
				await store.dispatch(BossesTypes.GET_BOSSES, 0)
			} catch (_) {
				failToast(i18n.t("messages.failFetchList"))
			}
			loading.value = false
		}

		return {
			bossList,
			selectedLevel,
			levels,
			loading,
			showBossImage,
			isFollowed,
			onPressBossTile,
			onFetchList
		}
	}
})
</script>
