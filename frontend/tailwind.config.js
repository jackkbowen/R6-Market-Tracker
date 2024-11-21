/** @type {import('tailwindcss').Config} */ 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      'GreyHair1': '#858280',
      'GreyHair2': '#B5B1B1.',
      'GreyHair3': '#CFCFC4',
      'GreyHair4': '#696969',
      'Mossy1': '#3d4127',
      'Mossy1Darker': '#262818',
      'Mossy2': '#636B2F',
    }
    },
  },
  plugins: [],
}

