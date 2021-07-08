import { createApp } from "vue"
import VWave from "v-wave"
import App from "./App.vue"
import store, { key } from "@/store"
import "./index.css"

createApp(App).use(store, key).use(VWave).mount("#app")
