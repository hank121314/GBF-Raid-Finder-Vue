<template>
	<div
		class="inline-block h-full w-6 cursor-col-resize bg-transparent"
		draggable="true"
		@dragstart.passive="onDragStart"
		@drag.passive="onDrag"
		@mousemove="onStartHoverSlide"
		@mouseleave="onEndHoverSlide"
	>
		<div class="h-full w-full flex items-center justify-center pointer-events-none select-none">
			<SwitchHorizontalIcon
				class="w-6 h-6 text-transparent transition durtaion-300 pointer-events-none select-none fill-current"
				:class="{ 'text-white': hoverSlide }"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"
import throttle from "lodash/throttle"
import { ListConfiguration } from "@/configs"
import { SwitchHorizontalIcon } from "@heroicons/vue/outline"
import { useVModel } from "@/utils/composables"

export default defineComponent({
	name: "TweetListSlider",
	components: { SwitchHorizontalIcon },
	props: {
		listWidth: {
			type: Number,
			default: ListConfiguration.width
		}
	},
	emits: ["changeWidth", "update:listWidth"],
	setup(props, { emit }) {
		const width = useVModel(props, "listWidth")
		const hoverSlide = ref(false)
		const dragStart = ref(0)
		const img = document.createElement("img")
		img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

		const onDrag = throttle(
			(e: DragEvent) => {
				// When e.x equals to 0 means that user stop the drag event
				if (e.x === 0) {
					hoverSlide.value = false
					emit("changeWidth")
					return
				}
				hoverSlide.value = true
				width.value += e.x - dragStart.value
				dragStart.value = e.x
				if (width.value > ListConfiguration.maxWidth) width.value = ListConfiguration.maxWidth
				if (width.value < ListConfiguration.minWidth) width.value = ListConfiguration.minWidth
			},
			50,
			{ leading: false, trailing: true }
		)
		const onDragStart = (e: DragEvent) => {
			e.dataTransfer?.setDragImage(img, 0, 0)
			dragStart.value = e.x
			hoverSlide.value = true
		}
		const onStartHoverSlide = () => {
			if (hoverSlide.value) return
			hoverSlide.value = true
		}
		const onEndHoverSlide = () => {
			if (!hoverSlide.value) return
			hoverSlide.value = false
		}

		return {
			width,
			hoverSlide,
			onDrag,
			onDragStart,
			onStartHoverSlide,
			onEndHoverSlide
		}
	}
})
</script>
