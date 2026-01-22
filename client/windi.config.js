export default {
  darkMode: 'class',
  extract: {
    include: ['./index.html', 'src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {
      colors: {
        'brand': {
          'black': '#1a1a1a',
          'dark': '#2d2d2d',
          'gold': '#d4a574',
          'gold-dark': '#c9a86c',
          'rose': '#f5e6e0',
          'blush': '#fdf8f5',
          'nude': '#e8d5c4',
          'champagne': '#f7e7ce',
          'burgundy': '#722f37',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('windicss/plugin/scroll-snap'),
  ],
}