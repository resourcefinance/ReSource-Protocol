import colors from "./colors"
const focusOutlineColor = colors.primary.dark

const shadows = {
  xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  sm: "0px 0px 8px rgba(143, 117, 255, 0.25)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "-2px 4px 8px 0px rgba(0, 0, 0, 0.15)",
  lg: "-2px 4px 8px 1px rgba(0, 0, 0, 0.15)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  outline: `0 0 0 0px ${focusOutlineColor}`,
  inner: "inset -1px 2px 8px rgba(0, 0, 0, 0.15)",
  none: "none",
  "dark-lg":
    "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px",
}

export default shadows
