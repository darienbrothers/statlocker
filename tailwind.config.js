/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6E57FF", // BrandPrimary
          tint: "#9B8BFF"
        },
        accent: "#00E08A",
        surface: {
          DEFAULT: "#0F0F12",
          elevated: "#16161A"
        },
        on: {
          surface: "#E8E8EA",
          muted: "#B5B5BB"
        },
        danger: "#DA2E2E",
        warning: "#C7781F",
        success: "#10B981",
        divider: "#25252A"
      },
      borderRadius: { xl: "16px", "2xl": "20px" }
    }
  },
  plugins: []
};

