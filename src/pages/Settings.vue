<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" @close="onClose">
			<div
				class="fixed w-full h-5/6 top-1/20 max-w-lg left-0 right-0 m-auto overflow-y-hidden"
			>
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<dialog-overlay />
				</TransitionChild>
				<TransitionChild
					as="template"
					enter="duration-300 ease-out"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
					<div
						class="flex w-full h-full max-w-9/10 bg-gray-800 rounded p-4 m-auto flex-col"
					>
						<tab v-model:selected="selected" :items="tabItems" />
						<slot v-if="selected === 0" name="boss-list" />
						<slot v-if="selected === 1" name="environment" />
					</div>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay
} from "@headlessui/vue"
import { Tab } from "@/components"

export default defineComponent({
	name: "Settings",
	components: {
		Dialog,
		DialogOverlay,
		Tab,
		TransitionRoot,
		TransitionChild
	},
	props: {
		isOpen: {
			type: Boolean
		}
	},
	emits: ["close"],
	setup(_, { emit }) {
		const i18n = useI18n()
		const selected = ref(0)
		const tabItems = computed(() => [
			{ label: i18n.t("label.follow") },
			{ label: i18n.t("label.settings") }
		])

		const onClose = () => {
			emit("close")
		}

		return {
			selected,
			tabItems,
			onClose
		}
	}
})
</script>

<style scoped></style>
