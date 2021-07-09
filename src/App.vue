<template>
	<f-a-b @click="onSettingsOpen" />
	<settings :is-open="isSettingsOpen" @close="onSettingsClose" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue"
import { FAB } from "@/components"
import { Settings } from "@/pages"

export default defineComponent({
	name: "App",
	components: { FAB, Settings },
	setup() {
		onMounted(() => {
			document.body.classList.add("bg-background")
		})

		const isSettingsOpen = ref(false)

		const onSettingsOpen = () => {
			isSettingsOpen.value = true
		}

		const onSettingsClose = () => {
			isSettingsOpen.value = false
		}

		return {
			isSettingsOpen,
			onSettingsOpen,
			onSettingsClose
		}
	}
})
</script>
