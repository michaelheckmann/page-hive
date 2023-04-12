/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        1: "1px",
      },
      fontFamily: {
        freight: ["var(--freight-font)", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
};
