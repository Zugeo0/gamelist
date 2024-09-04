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
      colors: {
        // allows catppuccin 'base' to be used in text
        // since text-base is already defined
        "cat-base": "#1e1e2e"
      }
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      defaultFlavour: "mocha"
    }),
  ],
}


