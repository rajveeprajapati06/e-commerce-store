/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Electric Blue
          dark: '#1d4ed8',
          light: '#eff6ff',
        },
        secondary: {
          DEFAULT: '#0f172a', // Sleek Navy / Slate
          dark: '#020617',
          light: '#1e293b',
        },
        accent: {
          DEFAULT: '#f59e0b', // Warm Gold / Amber
          dark: '#d97706',
          light: '#fef3c7',
        },
        customBg: '#f8fafc', // Soft light gray-blue
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -1px rgba(15, 23, 42, 0.03)',
        premiumHover: '0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
      },
    },
  },
  plugins: [],
}
