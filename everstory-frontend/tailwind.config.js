/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0095f6",
        secondary: "#262626",
        background: "#fafafa",
        border: "#dbdbdb",
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
} 