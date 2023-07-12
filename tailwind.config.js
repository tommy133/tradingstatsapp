/** @type {import('tailwindcss').Config} */
plugin = require('tailwindcss/plugin');
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'dark': '#333',
        'dark-grey': '#3A3A3A',
        'green': '#32cd32',
        'red': '#D43B27'
      }
    },
  },
}

