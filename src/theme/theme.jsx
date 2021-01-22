import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

import WorkSansTTF from '../assets/fonts/Rajdhani-Medium.ttf';

const WorkSans = {
  fontFamily: 'Rajdhani Medium',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Rajdhani Medium'),
    local('Rajdhani Medium'),
    url(${WorkSansTTF}) format('truetype')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export const colors = {
  pricecolor: '#171819',
  white: "#fff",
  black: '#000',
  blue: "#383633",
  lightGray: "#EEC542;",
  darkGray: "rgba(27, 28, 29,.5)",
  green: '#1abc9c',
  red: '#ed4337',
  orange: 'orange',

  text: "#212529",
};

const breakpoints = createBreakpoints({
  keys: ["xs", "mm", "sm", "md", "lg", "xl"],
  values: {
    xs: 0,
    mm: 300,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1800
  }
})

const iswapTheme =  {
  typography: {
    fontFamily: [
      '"Rajdhani Medium"',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '28px',
      fontWeight: '600',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      letterSpacing: '0.5px',
      lineHeight: 1.2,
      color: colors.pricecolor,
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      letterSpacing: '0.5px',
      lineHeight: 1.2,
      color: colors.blue
    },
    h3: {
      fontSize: '18px',
      fontWeight: '500',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      letterSpacing: '0.5px',
      lineHeight: 1.2,
      color: colors.pricecolor,
    },
    h4: {
      fontSize: '20px',
      fontWeight: '400',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
      letterSpacing: '0.5px',
      color: colors.pricecolor,
      '@media (max-width: 899px)': {
        fontSize: '18px',
      },
    },
    h5: {
      fontSize: '16px',
      fontWeight: '400',
      letterSpacing: '0.5px',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      lineHeight: 1.2,
      '@media (max-width: 899px)': {
        fontSize: '14px',
      },
    },
    h6: {
      fontSize: '12px',
      fontWeight: '500',
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      letterSpacing: '0.2px',
      lineHeight: 1.2,
      color: colors.darkGray
    },
  },
  type: 'light',
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [WorkSans],
      },
    }
  },
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.blue
    },
    text: {
      primary: colors.text,
      secondary: colors.text
    }
  },
  breakpoints: breakpoints
};

export default iswapTheme;
