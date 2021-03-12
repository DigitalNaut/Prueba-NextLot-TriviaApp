const { maxHeight } = require("tailwindcss/defaultTheme");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      height: {
        'half': '49vh',
      }
    },
    fontFamily: {
      lora: ["Lora", ...defaultTheme.fontFamily.sans],
      rockSalt: ["Rock Salt"],
    },
    colors: {
      white: "#FFF",
      haiti: "#0C122F",
      bombai: "#B2B5C0",
      indigo: "#454EBB",
      havelockBlue: "#65A4DD",
    },
  },
};
