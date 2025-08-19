// tailwind.config.js

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'], // DOUBLE quotes around font name
      },
    },
  },
  plugins: [],
};
