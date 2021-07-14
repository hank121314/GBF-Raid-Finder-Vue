const colors = require("tailwindcss/colors")

module.exports = {
	purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				transparent: "transparent",
				black: colors.black,
				white: colors.white,
				gray: colors.gray,
				coolGray: "#4E4E4E",
				darkGray: "#222222",
				background: "#202128"
			},
			backgroundSize: {
				full: "100%"
			},
			backgroundPosition: {
				"top-1/5": "0% 20%"
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
				5: "1.25rem"
			}
		}
	},
	variants: {
		extend: {
			backgroundColor: ["active"]
		}
	},
	plugins: []
}
