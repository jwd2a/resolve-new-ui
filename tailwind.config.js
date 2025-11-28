/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        foreground: '#1a1a1a',
        primary: {
          DEFAULT: '#5b21b6',
          light: '#7c3aed',
          dark: '#4c1d95',
        },
        success: '#10b981',
        border: '#e5e7eb',
      },
    },
  },
  plugins: [],
}
