/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F4ED',
          dark: '#EFE9DF',
        },
        espresso: {
          DEFAULT: '#30251F',
          light: '#4A3728',
        },
        terracotta: {
          DEFAULT: '#A65D43',
          light: '#C07A5E',
          dark: '#8B4D36',
        },
        latte: '#81766B',
        border: '#E0D9CE',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
