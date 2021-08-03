<template>
	<Menu as="div" class="relative inline-block text-left">
		<MenuButton>
			<button aria-label="menu-radio-icon-button" v-wave class="rounded-full px-2 py-2">
				<slot name="icon" />
			</button>
		</MenuButton>
		<transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<MenuItems
				class="
					absolute
					right-0
					mt-2
					w-32
					origin-top-right
					bg-gray-800
					divide-y divide-gray-100
					rounded-md
					shadow-lg
					ring-1 ring-white ring-opacity-5
					focus:outline-none
				"
			>
				<div>
					<MenuItem v-for="(item, index) in items" :key="item.name" class="hover:bg-gray-600">
						<button
							v-wave
							class="group flex items-center justify-between w-full px-2 py-2 text-md"
							@click="onClick(index)"
						>
							<div
								class="
									flex
									items-center
									justify-center
									border
									rounded-full
									bg-transparent
									min-w-4 min-h-4
									md:min-w-5 md:min-h-5
								"
								:class="{ 'border-white': index === selected, 'border-gray-500': index !== selected }"
							>
								<div
									class="w-0 h-0 rounded-full bg-transparent transition duration-300"
									:class="{ 'bg-white w-2 h-2 md:w-3 md:h-3': index === selected }"
								/>
							</div>
							<p class="text-white font-sans">
								{{ item.label }}
							</p>
						</button>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"

export type MenuRadioItemProps = {
	name: string
	label: string
}

export default defineComponent({
	name: "MenuList",
	components: {
		Menu,
		MenuButton,
		MenuItems,
		MenuItem
	},
	props: {
		items: {
			type: Array as PropType<MenuRadioItemProps[]>,
			default: () => []
		},
		selected: {
			type: Number,
			required: true
		}
	},
	emits: ["click"],
	setup(_, { emit }) {
		const onClick = (index: number) => {
			emit("click", index)
		}

		return {
			onClick
		}
	}
})
</script>
