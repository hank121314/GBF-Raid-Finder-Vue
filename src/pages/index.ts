import { defineAsyncComponent } from "vue"

export const Settings = defineAsyncComponent({ loader: () => import("./Settings.vue") })
export const BossList = defineAsyncComponent({ loader: () => import("./BossList.vue") })
export const Environment = defineAsyncComponent({ loader: () => import("./Environment.vue") })
export const TweetLists = defineAsyncComponent({ loader: () => import("./TweetLists/TweetLists.vue") })
export const RaidBossLists = defineAsyncComponent({ loader: () => import("./RaidBossLists/RaidBossLists.vue") })

