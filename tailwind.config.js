/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FDFBF7', 100: '#FAF6ED', 200: '#F5ECDA', 300: '#EDE0C4', 400: '#D4C5A0', 500: '#B8A67E' },
        espresso: { 50: '#F5F0EB', 100: '#E8DFD4', 200: '#C9B99E', 300: '#A89070', 400: '#7D6548', 500: '#5A4530', 600: '#3D2E1F', 700: '#2A1F14', 800: '#1A130C', 900: '#0D0A07' },
        gold: { 400: '#D4A853', 500: '#C9963C', 600: '#B8842E' },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      letterSpacing: { ultrawide: '0.35em' },
      transitionDuration: { 400: '400ms', 600: '600ms' },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
