/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        primary: {
          light: '#8b5cf6',   // violet-500
          DEFAULT: '#7c3aed', // violet-600
          dark: '#6d28d9'     // violet-700
        },
        accent: {
          light: '#14b8a6',   // teal-400
          DEFAULT: '#0d9488', // teal-500
        },
      },
      boxShadow: {
        card: '0 10px 15px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [],
}