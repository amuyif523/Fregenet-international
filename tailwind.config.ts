import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#98001b",
        "on-primary": "#ffffff",
        "primary-container": "#be1e2d",
        "on-primary-container": "#ffd3d1",
        "primary-fixed": "#ffdad8",
        "on-primary-fixed": "#410006",
        "primary-fixed-dim": "#ffb3b0",
        "on-primary-fixed-variant": "#930019",
        "secondary": "#5f5e5f",
        "on-secondary": "#ffffff",
        "secondary-container": "#e2dfe0",
        "on-secondary-container": "#636263",
        "secondary-fixed": "#e5e2e3",
        "on-secondary-fixed": "#1b1b1c",
        "secondary-fixed-dim": "#c8c6c7",
        "on-secondary-fixed-variant": "#474647",
        "tertiary": "#005066",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#006a85",
        "on-tertiary-container": "#abe6ff",
        "tertiary-fixed": "#baeaff",
        "on-tertiary-fixed": "#001f29",
        "tertiary-fixed-dim": "#85d1ef",
        "on-tertiary-fixed-variant": "#004d62",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "background": "#f9f9f9",
        "on-background": "#1a1c1c",
        "surface": "#f9f9f9",
        "on-surface": "#1a1c1c",
        "surface-variant": "#e2e2e2",
        "on-surface-variant": "#5b403f",
        "outline": "#8f6f6e",
        "outline-variant": "#e3bebb",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",
        "inverse-primary": "#ffb3b0",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-tint": "#b91a2a"
      },
      fontFamily: {
        "headline": ["Public Sans", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
      },
      backgroundImage: {
         "hero-gradient": "linear-gradient(to bottom, rgba(249, 249, 249, 0) 60%, rgba(249, 249, 249, 1) 100%)",
      },
      boxShadow: {
        "editorial": "0 20px 40px rgba(26, 28, 28, 0.04)"
      }
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/forms"),
  ],
};
export default config;
