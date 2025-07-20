/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AXiM Global Brand Colors from the design guide
        axim: {
          blue: {
            DEFAULT: '#0059B2',
            light: '#0086FF',
            dark: '#003F80',
          },
          navy: {
            DEFAULT: '#1A1E2D',
            light: '#252A3D',
            dark: '#12151F',
          },
          gray: {
            DEFAULT: '#8A94A6',
            light: '#B0B7C3',
            dark: '#3D4561',
          },
          white: '#E6E8EC',
        },
        // Success/Error/Warning
        success: {
          DEFAULT: '#00C48C',
          light: '#E0FFF6',
        },
        warning: {
          DEFAULT: '#FFAD0D',
          light: '#FFF6E0',
        },
        error: {
          DEFAULT: '#FF3B3B',
          light: '#FFE0E0',
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 89, 178, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 134, 255, 0.8)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'axim-gradient': 'linear-gradient(135deg, #0059B2 0%, #0086FF 100%)',
      },
    },
  },
  plugins: [],
};