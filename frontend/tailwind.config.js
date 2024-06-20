/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "src/**/*.{html,js,ts,jsx,tsx,svelte}"
  ],
  theme: {
    extend: {
      fontFamily: {
        exo: ['Exo Variable', 'sans-serif'],
        lalezar: ['Lalezar', 'system-ui']
      },
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      defaultFlavour: "mocha"
    }),
  ],
}

