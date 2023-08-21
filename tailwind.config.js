/** @type {import('tailwindcss').Config} */
plugin = require('tailwindcss/plugin');
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'dark': '#333',
        'dark-gray': '#3A3A3A',
        'blue': '#2dd4bf',
        'bright-blue': '#0096FF',
        'orange': '#FF9033',
        'light-gray': '#D3D3D3',
        'green': '#32CD32',
        'dark-green': '#006400',
        'red-violet': '#c71558',
        'red': '#D43B27'
      }
    },
  },
}

