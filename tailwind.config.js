const colors = require("tailwindcss/colors")

module.exports = {
	purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			backgroundSize: {
				full: "100%"
			},
			backgroundPosition: {
				"top-1/5": "0% 20%"
			},
			colors: {
				transparent: "transparent",
				black: colors.black,
				white: colors.white,
				gray: colors.gray,
				coolGray: "#4E4E4E",
				darkGray: "#222222",
				background: "#202128"
			},
			cursor: {
				"col-resize": "col-resize"
			},
			fontFamily: {
				sans: ["Noto Sans TC"]
			},
			inset: {
				"1/20": "5%"
			},
			maxWidth: {
				"9/10": "90%"
			},
			minHeight: {
				4: "1rem",
				5: "1.25rem"
			},
			minWidth: {
				4: "1rem",
				5: "1.25rem",
				40: "10rem",
				72: "18rem"
			},
			boxShadow: {
				deep: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
			}
		}
	},
	variants: {
		extend: {
			height: ["hover"],
			backgroundColor: ["active"]
		}
	},
	plugins: []
}
