/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPrimary: '#6E57FF',
        accent: '#00E08A',
        surface: '#1A1A1A',
        onSurface: '#FFFFFF',
        muted: '#6B7280',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      },
      fontFamily: {
        'anton': ['Anton'],
        'jakarta': ['PlusJakartaSans'],
      },
    },
  },
  plugins: [],
}

