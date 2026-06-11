import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        coral: "#e85d4f",
        mint: "#35b889",
        paper: "#faf7f2",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
