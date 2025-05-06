export default {
    content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          primary: {
            background: "var(--primary-background)",
            foreground: "var(--primary-foreground)",
          },
          secondary: {
            background: "var(--secondary-background)",
            foreground: "var(--secondary-foreground)",
          },
          accent: {
            DEFAULT: "var(--accent-color)",
            foreground: "var(--accent-foreground)",
          },
          page: {
            background: "var(--page-background)",
          },
          border: {
            primary: "var(--border-primary)",
            secondary: "var(--border-secondary)",
          },
        },
        fontFamily: {
          montserrat: ["Montserrat", "sans-serif"],
          americana: ["Americana BT", "serif"],
        },
      },
    },
    plugins: [],
  };