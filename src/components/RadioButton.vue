<template>
	<RadioGroup
		v-model="selectedItem"
		class="col-span-3 grid gap-4 justify-between w-full"
		:class="`grid-cols-${items.length}`"
	>
		<RadioGroupOption
			v-for="item in items"
			v-slot="{ checked }"
			:key="item.label"
			:value="item.value"
			class="flex items-center justify-center cursor-pointer"
		>
			<div
				class="flex items-center justify-center border border-white rounded-full bg-transparent min-w-4 min-h-4 md:min-w-5 md:min-h-5"
				:class="{ 'border-blue-500': checked }"
			>
				<div
					class="w-0 h-0 rounded-full bg-transparent transition duration-300"
					:class="{ 'bg-blue-500 w-2 h-2 md:w-3 md:h-3': checked }"
				/>
			</div>
			<span class="text-sm text-white ml-2 md:text-lg md:ml-4">{{ item.label }}</span>
		</RadioGroupOption>
	</RadioGroup>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { RadioGroup, RadioGroupOption } from "@headlessui/vue"
import { useVModel } from "@/utils/composables"

export type RadioItem = {
	label: string
	value: string | boolean
}

export default defineComponent({
	components: { RadioGroup, RadioGroupOption },
	props: {
		items: {
			type: Array as PropType<RadioItem[]>,
			required: true
		},
		selected: {
			type: [String, Boolean],
			default: null
		}
	},
	setup(props) {
		return {
			selectedItem: useVModel(props, "selected")
		}
	}
})
</script>
