/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
    },
  },
  plugins: [],
};
