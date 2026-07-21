/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Liquid Glass palette — deep indigo night with luminous aqua/violet glass.
        night: "#0B1020",
        abyss: "#070A15",
        glass: "rgba(255,255,255,0.08)",
        aqua: "#38E1D6",
        violet: "#8B7CF6",
        amber: "#F6C177",
        rose: "#F472B6",
      },
      borderRadius: {
        squircle: "2rem",
        pill: "999px",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
        glow: "0 0 40px rgba(56,225,214,0.25)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
