/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AURA OS Color System — Deep charcoal with Mint Glow accent
        night: "#0D0D12",           // Primary dark background
        abyss: "#0A0A0F",           // Deeper background for modals
        surface: "#12121A",         // Card/panel background
        surface-hover: "#181820",   // Hover state
        border: "rgba(255,255,255,0.08)",  // Glass borders
        border-strong: "rgba(255,255,255,0.14)",
        // Mint Glow — brand accent
        aura: "#00F5A0",            // Primary mint glow
        aura-dim: "rgba(0, 245, 160, 0.2)",
        aura-soft: "rgba(0, 245, 160, 0.1)",
        // Supporting colors
        violet: "#8B7CF6",
        amber: "#F6C177",
        rose: "#F472B6",
        // Text
        text-primary: "#E8ECF6",
        text-secondary: "rgba(232, 236, 246, 0.7)",
        text-muted: "rgba(232, 236, 246, 0.45)",
        // Night for button text
        night-text: "#0D0D12",
      },
      borderRadius: {
        squircle: "2rem",
        pill: "999px",
        '2xl': "1.25rem",
        '3xl': "1.75rem",
      },
      backdropBlur: {
        xs: "2px",
        '4xl': "72px",
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(255,255,255,0.03) inset",
        'glass-elevated': "0 16px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.1) inset",
        'glass-panel': "0 2px 16px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
        aura: "0 0 24px rgba(0,245,160,0.35), 0 0 48px rgba(0,245,160,0.15)",
        'aura-subtle': "0 0 16px rgba(0,245,160,0.2)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        'fade-in': {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        'slide-up': {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        'scale-in': {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        'fade-in': "fade-in 200ms ease-out",
        'slide-up': "slide-up 300ms ease-out",
        'scale-in': "scale-in 200ms ease-out",
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
