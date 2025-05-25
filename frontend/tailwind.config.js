// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#D1FAE5',
        },
        secondary: {
          DEFAULT: '#1E40AF',
          dark: '#1E3A8A',
          light: '#DBEAFE',
        },
        background: '#F3F4F6',
        sidebar: '#FFFFFF',
      },
    },
  },
  plugins: [],
}