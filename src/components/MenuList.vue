<template>
	<Menu as="div" class="relative inline-block text-left">
		<MenuButton>
			<button aria-label="menu-list-icon-button" v-wave class="rounded-full px-2 py-2">
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
					origin-top-right
					bg-gray-800
					divide-y divide-gray-100
					rounded-md
					shadow-lg
					ring-1 ring-white ring-opacity-5
					focus:outline-none
				"
			>
				<div v-for="(subItems, index) in items" :key="index">
					<MenuItem v-for="item in subItems" :key="item.name" class="hover:bg-gray-600">
						<button
							v-wave
							class="group flex items-center justify-between w-full px-2 py-2 text-md"
							@click="onClick(item)"
						>
							<component :is="item.icon" class="w-6 h-6 text-white mr-4" />
							<p class="text-white whitespace-nowrap">
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

export type MenuItemProps = {
	name: string
	label: string
	icon: any
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
			type: Array as PropType<MenuItemProps[][]>,
			default: () => []
		}
	},
	emits: ["click"],
	setup(_, { emit }) {
		const onClick = (item: MenuItemProps) => {
			emit("click", item)
		}

		return {
			onClick
		}
	}
})
</script>
