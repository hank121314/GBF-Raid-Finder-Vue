<template>
	<Listbox v-model="selectedItem">
		<div class="w-full relative mt-1">
			<ListboxButton
				class="flex w-full items-center justify-between p-2 bg-darkGray rounded"
			>
				<p class="text-white text-base md:text-lg text-center w-full">
					{{ items[selected].label }}
				</p>
				<ChevronDownIcon class="text-white w-6 h-6" />
			</ListboxButton>
			<Transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute w-full py-1 overflow-auto text-base bg-darkGray rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
				>
					<ListboxOption
						v-for="(item, index) in items"
						:key="index"
						:value="index"
						class="transition p-2 hover:bg-coolGray"
					>
						<p class="text-white text-lg cursor-pointer text-center">
							{{ item.label }}
						</p>
					</ListboxOption>
				</ListboxOptions>
			</Transition>
		</div>
	</Listbox>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption
} from "@headlessui/vue"
import { ChevronDownIcon } from "@heroicons/vue/solid"
import { useVModel } from "@/utils/composables"

export type SelectItem = {
	label: string
}

export default defineComponent({
	name: "Selector",
	components: {
		ChevronDownIcon,
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption
	},
	props: {
		items: {
			type: Array as PropType<SelectItem[]>,
			required: true
		},
		selected: {
			type: Number,
			required: true
		}
	},
	setup(props) {
		return {
			selectedItem: useVModel(props, "selected")
		}
	}
})
</script>

<style scoped></style>
