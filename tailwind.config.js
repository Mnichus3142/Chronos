// Import the colors module
import colors from "./src/lib/colors.js";

// Import the tailwind-scrollbar plugin
import tailwindScrollbar from "tailwind-scrollbar";

// Import fluid for tailwind
import fluid, { extract } from 'fluid-tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app.html", "./src/**/*.{svelte,js}", extract],
  theme: {
    extend: {
      colors: {
        primary: colors.shadow.primary,
        secondary: colors.shadow.secondary,
        third: colors.shadow.secondary,
        accent: colors.shadow.accent,
        accentNotActive: colors.shadow.accentNotActive,
        background: colors.shadow.background,
        textColor: colors.shadow.textColor,
        mottoColor: colors.shadow.mottoColor,
      },
      fontFamily: {
        basic: ["Rubik", "sans-serif"],
        motto: ["Playwrite HR Lijeva", "cursive"],
        clock: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [tailwindScrollbar, fluid]
};