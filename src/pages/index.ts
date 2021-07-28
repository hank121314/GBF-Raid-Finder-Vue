import { defineAsyncComponent } from "vue"

export const Settings = defineAsyncComponent({ loader: () => import("./Settings.vue") })
export const BossList = defineAsyncComponent({ loader: () => import("./BossList.vue") })
export const Environment = defineAsyncComponent({ loader: () => import("./Environment.vue") })
export { default as TweetLists } from "./TweetLists/TweetLists.vue"
