import { SystemStyleObjectRecord } from "@chakra-ui/react"
import typography from "./foundations/typography"

const { fonts, fontWeights } = typography

export const title = {
  // fontSize: ["24px"],
  fontSize: ["h1"],
  fontFamily: fonts.heading,
  fontWeight: fontWeights.black,
  fontStyle: "normal",
}

export const subtitle = {
  // fontSize: ["18px"],
  fontSize: ["h2"],
  fontFamily: fonts.heading,
  fontWeight: fontWeights.bold,
  fontStyle: "normal",
}

export const header = {
  // fontSize: ["18px"],
  fontSize: ["h3"],
  fontFamily: fonts.heading,
  fontWeight: fontWeights.medium,
  fontStyle: "normal",
}

export const subheader = {
  // fontSize: ["14px"],
  fontSize: ["h4"],
  fontFamily: fonts.heading,
  fontWeight: fontWeights.bold,
  fontStyle: "normal",
}

export const number = {
  // fontSize: ["16px"],
  fontSize: ["h5"],
  fontFamily: fonts.mono,
  fontWeight: fontWeights.normal,
  fontStyle: "normal",
}

export const caption = {
  // fontSize: ["12px"],
  fontSize: ["h6"],
  fontFamily: fonts.body,
  fontWeight: fontWeights.normal,
  fontStyle: "normal",
}

export const body = {
  // fontSize: ["14px"],
  fontSize: ["p"],
  fontFamily: fonts.body,
  fontWeight: fontWeights.normal,
  fontStyle: "normal",
  lineHeight: "21px",
}

// convenience for alternate naming convention
const aliases = {
  h1: title,
  h2: subtitle,
  h3: header,
  h4: subheader,
  h5: number,
  price: number,
  h6: caption,
  p: body,
}

export const textStyles: SystemStyleObjectRecord = {
  title,
  subtitle,
  header,
  subheader,
  number,
  caption,
  body,
  ...aliases,
}
