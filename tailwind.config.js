/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E53935',
          dark: '#C62828',
          light: '#FFEBEE',
        },
        text: {
          dark: '#2c3e50',
          light: '#5a6a7a',
        },
        background: {
          light: '#FFFFFF',
          alternate: '#F9FAFB',
        },
        border: '#EAECEF',
        // Add semantic color aliases for better consistency
        'light-bg': '#FFFFFF',
        'alt-bg': '#F9FAFB',
        'dark-text': '#2c3e50',
        'light-text': '#5a6a7a',
        'border-color': '#EAECEF',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};