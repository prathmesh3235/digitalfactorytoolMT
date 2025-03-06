/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'light-gray': '#F5F5F5',
        'cool-blue': '#E3F2FD',
        'light-teal': '#E0F7FA',
        'soft-green': '#E8F5E9',
        'light-lavender': '#F3E5F5',
      },
      spacing: {
        '10rem': '10rem',
      },
    },
  },
  plugins: [],
};
