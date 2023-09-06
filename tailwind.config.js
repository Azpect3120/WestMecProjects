/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["views/*.{html,ejs,js}", "views/partials/*.{html,ejs,js}"],
  theme: {
    extend: {
      colors:{ "bg-darker": "#141414", "bg-dark": "#1B1B1B" }
    },
  },
  plugins: [],
}

