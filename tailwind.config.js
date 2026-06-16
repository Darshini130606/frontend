/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16202A",
        muted: "#667085",
        paper: "#F7F8FA",
        teal: {
          50: "#E9FBF8",
          100: "#CFF6EF",
          600: "#0D9488",
          700: "#0F766E"
        },
        amber: {
          100: "#FEF3C7",
          500: "#F59E0B"
        }
      },
      boxShadow: {
        soft: "0 16px 40px rgba(22, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};
