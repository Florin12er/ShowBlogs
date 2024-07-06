/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
        hljs: {
      theme: 'night-owl', // Choose a theme or use a custom one
    },
  },
  plugins: [],
}
