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
      },
      animation: {
        'slide-down': 'slide-down 0.3s ease-out',
        'bounce-pop': 'bounce-pop 0.6s ease-out',
      },
      keyframes: {
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-pop': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    }
  },
  plugins: [],
}
