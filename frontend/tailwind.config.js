/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F4FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#4300FF',
          600: '#0065F8',
          700: '#00CAFF',
          800: '#00FFDE',
          900: '#1E1B4B'
        },
        gradient: {
          primary: 'linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%)',
          secondary: 'linear-gradient(135deg, #0065F8 0%, #00CAFF 100%)',
          tertiary: 'linear-gradient(135deg, #00CAFF 0%, #00FFDE 100%)'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #0065F8 0%, #00CAFF 100%)',
        'gradient-tertiary': 'linear-gradient(135deg, #00CAFF 0%, #00FFDE 100%)',
        'gradient-soft': 'linear-gradient(135deg, rgba(67, 0, 255, 0.1) 0%, rgba(0, 101, 248, 0.05) 50%, rgba(0, 202, 255, 0.03) 100%)'
      },
      boxShadow: {
        'modern': '0 4px 12px rgba(67, 0, 255, 0.06)',
        'modern-hover': '0 8px 24px rgba(67, 0, 255, 0.12)',
        'modern-elevated': '0 12px 32px rgba(67, 0, 255, 0.18)',
        'modern-neon': '0 0 20px rgba(67, 0, 255, 0.3)'
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out infinite 2s',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'float-delayed': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-15px)',
          },
        },
        'fade-in-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}
