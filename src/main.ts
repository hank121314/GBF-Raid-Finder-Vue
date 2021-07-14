import { createApp } from "vue"
import VWave from "v-wave"
import { util, configure } from "protobufjs/minimal"
import * as Long from "long"
import App from "@/App.vue"
import i18n from "@/locales"
import store, { key } from "@/store"
import "mosha-vue-toastify/dist/style.css"
import "./index.css"

// Fixes: https://github.com/protobufjs/protobuf.js/issues/940
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
util.Long = Long
configure()

createApp(App).use(store, key).use(i18n).use(VWave).mount("#app")
