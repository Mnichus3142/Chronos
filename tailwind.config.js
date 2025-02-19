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
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        third: 'var(--color-third)',
        accent: 'var(--color-accent)',
        accentNotActive: 'var(--color-accent-not-active)',
        background: 'var(--color-background)',
        textColor: 'var(--color-text)',
        mottoColor: 'var(--color-motto)',
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