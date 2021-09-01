<template>
	<Disclosure v-slot="{ open }" as="div">
		<slot name="header" :open="open" />
		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-75 ease-out"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<DisclosurePanel><slot name="body" /></DisclosurePanel>
		</transition>
	</Disclosure>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { Disclosure, DisclosurePanel } from "@headlessui/vue"

export default defineComponent({
	components: {
		Disclosure,
		DisclosurePanel
	},
	setup() {
		return {}
	}
})
</script>
