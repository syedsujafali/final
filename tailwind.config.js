/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rosegold: {
          300: '#E0BFB8',
          400: '#C8A2C8',
          500: '#B76E79',
          600: '#C07C88',
        },
        crimson: {
          900: '#8B0000',
          950: '#4A0404',
        }
      },
      animation: {
        'glitch': 'glitch 0.2s linear 3',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'firefly-float': 'firefly-float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'text-shimmer': 'text-shimmer 2.5s ease-out infinite alternate',
        'cinematic-pan': 'cinematic-pan 20s linear infinite alternate',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        'firefly-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: 0 },
          '20%': { opacity: 0.8 },
          '50%': { transform: 'translate(20px, -50px) scale(1.2)' },
          '80%': { opacity: 0.8 },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)', filter: 'drop-shadow(0 0 5px rgba(255, 105, 180, 0.2))' },
          '50%': { opacity: 1, transform: 'scale(1.02)', filter: 'drop-shadow(0 0 20px rgba(255, 105, 180, 0.8))' }
        },
        'text-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        'cinematic-pan': {
          '0%': { transform: 'scale(1.05) translate(0, 0)' },
          '100%': { transform: 'scale(1.1) translate(-2%, -2%)' }
        }
      }
    },
  },
  plugins: [],
}
