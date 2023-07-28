/** @type {import('tailwindcss').Config} */
plugin = require('tailwindcss/plugin');
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'dark': '#333',
        'dark-grey': '#3A3A3A',
        'orange': '#FF9033',
        'light-grey': '#D3D3D3',
        'green': '#32CD32',
        'dark-green': '#006400',
        'red-violet': '#c71558',
        'red': '#D43B27'
      }
    },
  },
}

