/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx,js}"],
  theme: {
    extend: {
      colors: {
        'custom-orange': '#FF4C00',  // Add your custom color here
      },
      fontFamily: {},
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "3rem",
        },
      },
      boxShadow: {
        "custom-inset":
          "3px 3px 4px rgba(0, 0, 0, 0.25), inset 2px 5px 6px rgba(255, 255, 255, 0.37), inset 0px -5px 6px rgba(0, 0, 0, 0.37)",
      },
      animation: {
        popup: "popupAnimation 0.3s ease-out forwards",
      },
      keyframes: {
        popupAnimation: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [ function ({ addUtilities }) {
    addUtilities(
      {
        '.appearance-none': {
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
        },
      },
      ['responsive', 'hover']
    );
  },  ],
};
