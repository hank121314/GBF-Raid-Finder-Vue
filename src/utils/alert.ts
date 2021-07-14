import { createToast } from "mosha-vue-toastify"

export const successToast = (message: string): void =>
	createToast(message, {
		type: "success",
		showIcon: true,
		transition: "slide",
		hideProgressBar: true,
		timeout: 2000
	})

export const failToast = (message: string): void =>
	createToast(message, {
		type: "danger",
		showIcon: true,
		transition: "slide",
		hideProgressBar: true,
		timeout: 2000
	})
