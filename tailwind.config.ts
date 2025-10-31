import type { Config } from "tailwindcss";

export default {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#228B22',
          600: '#1a6b1a',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
