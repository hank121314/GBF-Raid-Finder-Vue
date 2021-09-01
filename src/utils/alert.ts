import { createToast } from "mosha-vue-toastify"

export const successToast = (message: string): void =>
	createToast(message, {
		type: "success",
		showIcon: true,
		transition: "slide",
		hideProgressBar: true,
		showCloseButton: false,
		timeout: 2000
	})

export const infoToast = (message: string): void =>
	createToast(message, {
		type: "info",
		showIcon: true,
		position: "bottom-center",
		toastBackgroundColor: "#6B7280",
		transition: "slide",
		hideProgressBar: true,
		timeout: 1000
	})

export const failToast = (message: string): void =>
	createToast(message, {
		type: "danger",
		showIcon: true,
		transition: "slide",
		hideProgressBar: true,
		timeout: 2000
	})
