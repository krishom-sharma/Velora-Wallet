/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF Pro Display", "SF Pro Text", "Inter", "ui-sans-serif", "system-ui"]
      },
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accentSoft: "rgb(var(--accent-soft) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(14, 18, 27, 0.18)",
        soft: "0 16px 40px rgba(18, 24, 38, 0.12)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(circle at top left, rgba(137, 196, 244, 0.65), transparent 35%), radial-gradient(circle at top right, rgba(255, 204, 112, 0.6), transparent 30%), radial-gradient(circle at bottom left, rgba(114, 239, 221, 0.55), transparent 30%)",
        "mesh-dark":
          "radial-gradient(circle at top left, rgba(79, 110, 255, 0.32), transparent 35%), radial-gradient(circle at top right, rgba(65, 182, 230, 0.28), transparent 30%), radial-gradient(circle at bottom left, rgba(22, 243, 173, 0.16), transparent 30%)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.95" }
        }
      }
    }
  },
  plugins: []
};
