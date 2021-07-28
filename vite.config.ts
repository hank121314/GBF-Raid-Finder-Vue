import path from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import visualizer from "rollup-plugin-visualizer"
import strip from "@rollup/plugin-strip"

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			plugins: [visualizer(), strip()],
			output: {
				manualChunks: {
					tone: [
						"node_modules/tone/build/esm/index.js",
						"node_modules/standardized-audio-context/build/es2019/module.js"
					]
				}
			}
		}
	},
	plugins: [
		vue(),
		vueI18n({
			// if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
			compositionOnly: false,
			runtimeOnly: false,

			// you need to set i18n resource including paths !
			include: path.resolve(__dirname, "/src/locales/**")
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "/src"),
			"vue-i18n": "vue-i18n/dist/vue-i18n.esm-bundler.js"
		}
	}
})
