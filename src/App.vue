<template>
	<f-a-b @click="onSettingsOpen" />
	<settings :is-open="isSettingsOpen" @close="onSettingsClose">
		<template #[SettingsTab.BOSS_LIST]>
			<boss-list />
		</template>
		<template #[SettingsTab.ENVIRONMENT]>
			<environment />
		</template>
	</settings>
	<tweet-lists />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import isEmpty from "lodash/isEmpty"
import without from "lodash/without"
import globalI18n from "@/locales"
import { SettingsTab } from "@/configs"
import { useStore } from "@/store"
import { Event, WebsocketEvents } from "@/services/websocket"
import Players from "@/services/players"
import WSWorker from "@/threads/websocket?worker"
import { FAB } from "@/components"
import { Settings, BossList, Environment, TweetLists } from "@/pages"
import TweetsType from "@/store/tweets/types"
import { successToast, failToast } from "@/utils/alert"

export default defineComponent({
	name: "App",
	components: { BossList, Environment, FAB, Settings, TweetLists },
	setup() {
		const store = useStore()
		let worker: Worker | null = null
		const i18n = useI18n()

		onMounted(async () => {
			// Apply background color to html body
			document.body.classList.add("bg-background")

			// Configure local with vuex persist state
			globalI18n.global.locale.value = store.state.configs.locale

			await store.dispatch(TweetsType.FETCH_PERSISTENCE_TWEETS, store.state.configs.followed)

			worker = new WSWorker()

			worker.onmessage = (event: MessageEvent<Event>) => {
				const { data } = event
				if (data.kind === WebsocketEvents.OPEN) {
					// Clone array to worker thread.
					worker?.postMessage([...store.state.configs.followed])
					successToast(i18n.t("messages.connected"))
				}
				if (data.kind === WebsocketEvents.ERROR || data.kind === WebsocketEvents.CLOSE) {
					failToast(i18n.t("messages.cannotConnect"))
				}
				if (data.kind === WebsocketEvents.MESSAGE) {
					store.dispatch(TweetsType.UPDATE_TWEET, data.data)
				}
			}

			await Players.load()
		})

		onUnmounted(() => {
			worker?.terminate()
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
			(newValue, oldValue) => {
				const purged = without(oldValue, ...newValue)
				const persistenceNeeded = without(newValue, ...oldValue)
				if (!isEmpty(purged)) {
					store.dispatch(TweetsType.CLEAR_TWEETS, purged[0])
				}
				store.dispatch(TweetsType.FETCH_PERSISTENCE_TWEETS, persistenceNeeded).then(() => {
					// Clone array to worker thread.
					worker?.postMessage([...newValue])
				})
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
			SettingsTab,
			isSettingsOpen,
			onSettingsOpen,
			onSettingsClose
		}
	}
})
</script>
