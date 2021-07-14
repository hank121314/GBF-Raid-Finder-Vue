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
		class="flex items-center justify-between bg-coolGray py-2 my-2 px-4 object-cover cursor-pointer rounded bg-full bg-top-1/5"
		@click="onClick"
	>
		<div class="flex flex-1 flex-col justify-between">
			<p v-if="!loading" class="text-base md:text-lg text-white">
				{{ boss?.jp_name ?? $t("label.unknown") }}
			</p>
			<p v-if="!loading" class="text-base md:text-lg text-white mt-1">
				{{ boss?.en_name ?? $t("label.unknown") }}
			</p>
			<div
				v-if="loading"
				class="w-full h-6 rounded bg-gray-500 animate-pulse"
			/>
			<div
				v-if="loading"
				class="w-3/4 h-6 mt-2 rounded bg-gray-500 animate-pulse"
			/>
		</div>
		<div
			v-if="followed"
			class="flex items-center justify-center bg-red-400 rounded-full h-8 w-8"
		>
			<HeartIcon class="h-6 w-6 text-white" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { HeartIcon } from "@heroicons/vue/solid"
import type RaidBoss from "@/proto/raid_boss"

export default defineComponent({
	name: "BossTile",
	components: { HeartIcon },
	props: {
		boss: {
			type: Object as PropType<RaidBoss>,
			default: () => ({})
		},
		showBossImage: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		followed: {
			type: Boolean,
			default: false
		}
	},
	emits: ["click"],
	setup(props, { emit }) {
		const onClick = () => {
			if (props.loading) return
			emit("click")
		}

		return {
			onClick
		}
	}
})
</script>
