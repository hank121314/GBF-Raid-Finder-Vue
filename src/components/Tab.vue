<template>
	<div class="flex w-full bg-darkGray rounded">
		<button
			v-for="(item, index) in items"
			:key="index"
			class="flex w-full transition-colors duration-300 rounded items-center justify-center m-1.5"
			:class="{
				'bg-coolGray': isSelected(index),
				'bg-transparent': !isSelected(index)
			}"
			@click="onClick(index)"
		>
			<p class="text-white p-2 text-sm md:text-base">
				{{ item.label }}
			</p>
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { useVModel } from "@/utils/composables"

export type TabItem = {
	label: string
}

export default defineComponent({
	name: "Tab",
	props: {
		selected: {
			type: Number,
			default: 0
		},
		items: {
			type: Array as PropType<TabItem[]>,
			required: true
		}
	},
	setup(props) {
		const selected = useVModel(props, "selected")
		const isSelected = (index: number) => props.selected === index

		const onClick = (index: number) => {
			selected.value = index
		}
		return {
			isSelected,
			onClick
		}
	}
})
</script>
