const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/*.{jsx,tsx}',
    './src/**/*.{jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        base: ['1px', {
          lineHeight: '1rem',
        }],
      },
      colors: {
        success: {
          0: colors.green[500],
          1: colors.green[600],
          2: colors.green[700],
        },
        primary: {
          0: colors.blue[600],
          1: colors.blue[700],
          2: colors.blue[800],
        },
        danger: {
          0: colors.red[600],
          1: colors.red[700],
          2: colors.red[800],
        },
        info: {
          0: colors.cyan[600],
          1: colors.cyan[700],
          2: colors.cyan[800],
        },
        warning: {
          0: colors.orange[600],
          1: colors.orange[700],
          2: colors.orange[800],
        },
      },
    },
  },
  plugins: [],
}
