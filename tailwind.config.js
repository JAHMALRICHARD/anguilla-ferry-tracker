/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        success: 'rgb(34, 197, 94)',
        warning: 'rgb(234, 179, 8)',
        danger: 'rgb(239, 68, 68)',
      }
    },
  },
  safelist: [
    'bg-success/10',
    'text-success',
    'bg-warning/10',
    'text-warning',
    'bg-danger/10',
    'text-danger',
  ],
  plugins: [],
}
