/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontSize: {},
      colors: {
        'green-500': '#90CF8E',
        'green-400': '#A7DCA5',
        'green-300': '#C6EDC3',
        'green-200': '#E4FDE1',
        'green-100': '#EFFDEE',
      }
    },
  },
  plugins: [],
};
