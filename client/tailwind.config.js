/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        care: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        sidebar: {
          DEFAULT: '#0F172A',
          50: '#1e293b',
          100: '#334155',
          200: '#475569',
          300: '#64748b',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(15, 23, 42, 0.08)',
        glow: '0 0 0 1px rgba(37, 99, 235, 0.08), 0 12px 40px -12px rgba(37, 99, 235, 0.25)',
        'glow-teal': '0 0 0 1px rgba(20, 184, 166, 0.08), 0 12px 40px -12px rgba(20, 184, 166, 0.25)',
        glass: '0 8px 32px rgba(15, 23, 42, 0.08)',
        'dark-sm': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'dark-glow': '0 0 0 1px rgba(37, 99, 235, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        float: 'float 5s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-slate': `linear-gradient(to right, rgb(226 232 240 / 0.5) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(226 232 240 / 0.5) 1px, transparent 1px)`,
        'gradient-brand': 'linear-gradient(to right, #2563EB, #14B8A6)',
        'gradient-care': 'linear-gradient(to right, #14B8A6, #06B6D4)',
        'gradient-sidebar': 'linear-gradient(180deg, #0F172A 0%, #1e293b 100%)',
      },
    },
  },
  plugins: [],
};
