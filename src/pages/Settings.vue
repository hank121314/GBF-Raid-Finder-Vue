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
						<boss-list v-if="selected === 0" :loading="loading" />
					</div>
				</TransitionChild>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import isEmpty from "lodash/isEmpty"
import {
	TransitionRoot,
	TransitionChild,
	Dialog,
	DialogOverlay
} from "@headlessui/vue"
import { useStore } from "@/store"
import BossesTypes from "@/store/bosses/types"
import BossList from "@/pages/BossList.vue"
import { Tab } from "@/components"

export default defineComponent({
	name: "Settings",
	components: {
		BossList,
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
	setup(props, { emit }) {
		const store = useStore()
		const i18n = useI18n()
		const selected = ref(0)
		const tabItems = ref([
			{ label: i18n.t("label.follow") },
			{ label: i18n.t("label.settings") }
		])
		const loading = ref(false)

		watch(
			() => props.isOpen,
			async (newValue) => {
				loading.value = true
				// If user open settings and bosses list isEmpty, we should automatically fetch bosses info.
				try {
					if (newValue && isEmpty(store.state.bosses.bosses)) {
						await store.dispatch(BossesTypes.GET_BOSSES, 0)
					}
				} catch (e) {
					console.log(e)
				}
				loading.value = false
			}
		)

		const onClose = () => {
			emit("close")
		}

		return {
			selected,
			tabItems,
			loading,
			onClose
		}
	}
})
</script>

<style scoped></style>
