const colors = require("./src/lib/colors.js");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/app.html", "./src/**/*.{svelte,js}"],
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
  plugins: [require("tailwind-scrollbar")],
};
