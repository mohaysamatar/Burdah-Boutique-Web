/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B1F3A',
        navyText: '#1A2740',
        ivory: '#FAF9F6',
        stone: '#E6E4DD',
        gold: '#C9A24B',
        goldDark: '#A8822F',
        success: '#6B8E6B',
        danger: '#8B3A3A',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        wide2: '0.08em',
      },
    },
  },
  plugins: [],
}
