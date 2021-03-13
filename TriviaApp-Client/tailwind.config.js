const { maxHeight } = require("tailwindcss/defaultTheme");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      height: {
        half: "49vh",
      },
      width: {
        half: "49vw",
      },
      colors: {
        white: "#FFF",
        haiti: "#0C122F",
        bombai: "#B2B5C0",
        indigo: "#454EBB",
        havelockBlue: "#65A4DD",
        errorRed: "#FCB3B5",
      },
    },
    fontFamily: {
      lora: ["Lora", ...defaultTheme.fontFamily.sans],
      rockSalt: ["Rock Salt"],
    },
  },
};
