/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        iphone: "390px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        main: "var(--main)",
        orange: "var(--orange)",
        yellow: "var(--yellow)",
        lightOrange: "var(--light-orange)",
        lighterOrange: "var(--lighter-orange)",
        darkOrange: "var(--dark-orange)",
        red: "var(--red)",
        blue: "var(--blue)",
        green: "var(--green)",
        grey: "var(--grey)",
        white: "var(--white)",
        black: "var(--black)",
        grey10: "var(--grey-10)",
        grey20: "var(--grey-20)",
        grey40: "var(--grey-40)",
        grey60: "var(--grey-60)",
        grey80: "var(--grey-80)",
        greyHighlight: "var(--grey-highlight)",
        lightBlue: "var(--light-blue)",
        darkContrast: "var(--dark-contrast)",
        mediumDarkContrast: "var(--medium-dark-contrast)",
        lightDarkContrast: "var(--light-dark-contrast)",
        coreDarkContrast: "var(--core-dark-contrast)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
}
