/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF5F5',
          100: '#FFE7F0',
          200: '#FFC2D9',
          300: '#FF9EC3',
          400: '#FF69B4',
          500: '#FF49A5',
          600: '#EB218B',
        },
        purple: {
          100: '#F3E8FF',
          400: '#C084FC',
          500: '#A855F7',
        },
        yellow: {
          100: '#FEFCE8',
          300: '#FDE047',
          400: '#FACC15',
        }
      },
      fontFamily: {
        cursive: ['"Comic Sans MS"', '"Marker Felt"', '"Segoe Script"', 'cursive'],
        cute: ['"Hiragino Sans"', '"Microsoft YaHei"', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}