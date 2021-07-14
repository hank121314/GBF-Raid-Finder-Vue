<template>
	<f-a-b @click="onSettingsOpen" />
	<settings :is-open="isSettingsOpen" @close="onSettingsClose">
		<template #boss-list>
			<boss-list />
		</template>
		<template #environment>
			<environment />
		</template>
	</settings>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import globalI18n from "@/locales"
import { useStore } from "@/store"
import ws, { WebsocketEvents } from "@/services/websocket"
import { FAB } from "@/components"
import { Settings, BossList, Environment } from "@/pages"
import TweetsType from "@/store/tweets/types"
import { successToast } from "@/utils/alert"

export default defineComponent({
	name: "App",
	components: { BossList, Environment, FAB, Settings },
	setup() {
		const store = useStore()
		const i18n = useI18n()

		onMounted(async () => {
			// Apply background color to html body
			document.body.classList.add("bg-background")

			// Configure local with vuex persist state
			globalI18n.global.locale.value = store.state.configs.locale

			// Subscribe the events from websockets
			ws.subscribeEvent((ev) => {
				if (ev.kind === WebsocketEvents.MESSAGE) {
					store.dispatch(TweetsType.UPDATE_TWEET, ev.data)
				}
			})

			// Establish the connection to websocket server
			await ws.connect()
			successToast(i18n.t("messages.connected"))

			// Regist the followed bosses
			ws.registerFollowBosses(store.state.configs.followed)
		})

		onUnmounted(async () => {
			await ws.close()
		})

		// Dynamically change i18n global locale while changing configs state.
		watch(
			() => store.state.configs.locale,
			(locale) => {
				globalI18n.global.locale.value = locale
			}
		)
		watch(
			() => store.state.configs.followed,
			(followed) => {
				ws.registerFollowBosses(followed)
			}
		)

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
