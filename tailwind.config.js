/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        meta: {
          blue: "#1877F2",
          "blue-hover": "#166fe5",
          "blue-light": "#E7F3FF",
          "blue-subtle": "rgba(24, 119, 242, 0.08)",
          bg: "#F0F2F5",
          surface: "rgba(255, 255, 255, 0.85)",
          card: "rgba(255, 255, 255, 0.92)",
          border: "rgba(228, 230, 235, 0.8)",
          "glass-border": "rgba(255, 255, 255, 0.7)",
          text: "#050505",
          muted: "#65676B",
          secondary: "#8A8D91",
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.05)",
        "glass-lg": "0 12px 40px 0 rgba(31, 38, 135, 0.12)",
        meta: "0 1px 2px rgba(0, 0, 0, 0.1)",
        "meta-hover": "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
