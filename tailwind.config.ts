import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0B10",        // pre-dawn sky
        panel: "#14161F",      // surfaces
        panel2: "#1B1E29",
        line: "#262A38",       // borders
        fog: "#7C8296",        // muted text
        bone: "#ECEAE3",       // primary text
        ember: "#FF7A45",      // sunrise / action / streak
        emberdim: "#B84E28",
        mint: "#5AD1A8",       // positive data
        violet: "#8A7BF2",     // secondary data
        gold: "#F2C14E",       // level / xp
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        rise: { "0%": { transform: "translateY(8px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        glow: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
        glow: "glow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
