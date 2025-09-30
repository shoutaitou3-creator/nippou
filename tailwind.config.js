/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#87B9CE',
        secondary: '#B0ABA5',
        accent: '#6BA8C4',
      },
    },
  },
  plugins: [],
};