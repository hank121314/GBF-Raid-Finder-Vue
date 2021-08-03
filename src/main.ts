import { createApp } from "vue"
import VWave from "v-wave"
import App from "@/App.vue"
import i18n from "@/locales"
import store, { key } from "@/store"
import "@/locales/dayjs"
import "mosha-vue-toastify/dist/style.css"
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import "@fontsource/noto-sans-tc"
import "./index.css"

createApp(App).use(store, key).use(i18n).use(VWave).mount("#app")
