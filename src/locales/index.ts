import { createI18n } from "vue-i18n"
import { Language } from "@/configs"
import en from "./en"
import zhTw from "./zh-tw"

const messages = {
	[Language.EN]: en,
	[Language.ZH_TW]: zhTw
}

const i18n = createI18n({
	legacy: false, // you must set `false`, to use Composition API
	locale: navigator.language, // set locale
	fallbackLocale: "en", // set fallback locale
	globalInjection: true,
	messages // set locale messages
})

export default i18n
