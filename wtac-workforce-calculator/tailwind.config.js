
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        wtac: {
          primary: "#1ebe5d",
          accent: "#42f57e",
          dark: "#0e5a2f"
        }
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
};
