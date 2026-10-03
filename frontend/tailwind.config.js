/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support manual toggle, but default to dark
  theme: {
    extend: {
      colors: {
        background: '#090909',
        card: '#171717',
        accent: '#D4AF37',
        text: '#F5F5F5',
        ink: '#1A120D',
        gold: '#F4A900',
        terra: '#C1666B',
        good: '#5E8C5A',
        cream: '#FAF3E6',
        muted: '#6B5D52',
        line: '#E4D8C4',
        nightbg: '#1A120D',
        nighttext: '#FAF3E6',
        nightmuted: '#B9AB98',
        nightline: '#3A2D24'
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '24px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
