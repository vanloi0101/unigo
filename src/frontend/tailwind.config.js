module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fffaf7',
          pink: '#ffcdc2',
          purple: '#9b7bae',
          dark: '#5e4b6e',
          text: '#4a4a4a'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      }
    }
  },
  plugins: [],
}
