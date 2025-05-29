/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // class-based toggling
  theme: {
    extend: {
      ccolors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",

        // 🎨 Anguilla theme additions (optional static tokens)
        sand: "#F5F5F0",
        turquoise: "#00B4D8",
        sunset: "#FF6B35",
        navy: "#002B5B",
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
      },
      transitionProperty: {
        DEFAULT:
          "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
      },
    },
  },
  safelist: [
    "bg-background",
    "bg-background/100",
    "text-foreground",
    "text-foreground/70",
    "text-foreground/60",
    "text-foreground/50",
    "border-foreground/30",
    "text-accent",
    "text-accent/80",
    "text-primary",
    "text-primary/90",
    // existing ones
    "bg-success/10",
    "text-success",
    "bg-warning/10",
    "text-warning",
    "bg-danger/10",
    "text-danger",
  ],
  plugins: [],
};
