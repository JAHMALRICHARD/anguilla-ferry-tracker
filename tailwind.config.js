/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // class-based toggling
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        success: "rgb(34, 197, 94)",
        warning: "rgb(234, 179, 8)",
        danger: "rgb(239, 68, 68)",

        // 🇦🇮 Anguilla Theme Colors
        sand: "#F5F5F0",
        turquoise: "#00B4D8",
        sunset: "#FF6B35",
        navy: "#002B5B", // optional for dark UI contrast
      },
      animation: {
        "spin-slow": "spin 6s linear infinite",
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
