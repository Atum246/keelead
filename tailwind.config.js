/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(0, 0%, 15%)",
        input: "hsl(0, 0%, 15%)",
        ring: "hsl(217, 91%, 60%)",
        background: "#000000",
        foreground: "#ffffff",
        card: { DEFAULT: "#0a0a0a", foreground: "#ffffff" },
        popover: { DEFAULT: "#0a0a0a", foreground: "#ffffff" },
        primary: { DEFAULT: "#3b82f6", foreground: "#ffffff" },
        secondary: { DEFAULT: "#0a0a0a", foreground: "#ffffff" },
        muted: { DEFAULT: "#0a0a0a", foreground: "#71717a" },
        accent: { DEFAULT: "#0a0a0a", foreground: "#ffffff" },
        destructive: { DEFAULT: "#ef4444", foreground: "#ffffff" },
        emerald: { DEFAULT: "#10b981", foreground: "#ffffff" },
        sidebar: { DEFAULT: "#050505", foreground: "#a1a1aa", border: "#1a1a1a" },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
