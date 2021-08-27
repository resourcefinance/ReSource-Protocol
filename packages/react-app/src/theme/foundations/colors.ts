const purple = {
  light: "#B79CED",
  main: "#957FEF",
  dark: "#7161EF",
  soft: "#EAE5FC",
  variantSoft: "#E3DFFC",
  softTransparent: "rgba(234, 229, 252, 0.25)",
}

const orange = {
  light: "#F5EE9E",
  main: "#F5C675",
  dark: "#F49E4C",
}

const blue = {
  dark: "#3772FF",
  main: "#699DFF",
  soft: "#D7E3FF",
  variantSoft: "#E1EBFF",
}

const green = {
  main: "#0A8754",
  500: "#0A8754",
}

const red = {
  main: "#FF3C38",
  500: "#FF3C38",
}

const gray = {
  main: "#595959",
  cultured: "#F2F2F2",
  gainsboro: "#D9D9D9",
  cement: "#BDBDBD",
  battleship: "#8C8C8C",
  davys: "#595959",
  100: "#F2F2F2",
  300: "#D9D9D9",
  500: "#BDBDBD",
  700: "#8C8C8C",
  900: "#595959",
}

const black = {
  main: "#000000",
}

const colors = {
  primary: purple,
  secondary: orange,
  alternate: blue,
  gray: gray,
  black: black,
  alert: {
    error: red.main,
    success: green.main,
  },
  purple,
  orange,
  green,
  blue,
  red,
}

export const gradients = {
  primary: "linear-gradient(260.01deg, #D56AFF 0%, #9475FF 100%);",
  blue: "linear-gradient(225deg, #699DFF 0.39%, #3772FF 100.39%);",
} as Record<string, string>

export default colors
