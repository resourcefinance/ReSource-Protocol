import { Icon, IconProps } from "@chakra-ui/react"
import React from "react"
import colors from "../../theme/foundations/colors"

export type GlyphColor = "black" | "gray" | "green" | "purple" | "red"
export type GlyphSize = "sm" | "md" | "lg" | "xl" | "2xl"
interface GlyphIconProps extends IconProps {
  bgColor?: GlyphColor
  color?: GlyphColor
  size?: GlyphSize
}

const iconSizeMap = {
  sm: "12px",
  md: "18px",
  lg: "24px",
  xl: "34px",
}

const Glyph = ({ color, bgColor = "gray", size = "md", ...rest }: GlyphIconProps) => {
  return (
    <Icon
      data-testid="glyph-icon"
      as="svg"
      role="img"
      boxSize={iconSizeMap[size]}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      {...rest}
    >
      <path
        data-testid="glyph-icon-bg"
        fill={colors[bgColor].main}
        d="M32 0C14.3271 0 0 14.3271 0 32C0 49.6729 14.3271 64 32 64C49.6729 64 64 49.6729 64 32C64 14.3271 49.6729 0 32 0Z"
      />
      <path
        d="M41.6702 36.1813C41.4533 35.8124 41.5547 35.3244 41.9218 35.1031C45.1618 33.1475 46.8738 29.5617 46.8738 25.5804C46.8738 18.1368 42.0276 13.6906 33.0356 13.6906H22.1938H20.224C19.6329 13.6906 19.2596 14.327 19.5485 14.8426L22.5538 20.2142C22.6907 20.4586 22.9493 20.6106 23.2293 20.6106H26.7653H28.1991H32.1111C35.3831 20.6106 37.5067 22.6835 37.5067 25.7564C37.5067 28.8791 35.5085 30.8524 32.136 30.8524H29.8089C29.2178 30.8524 28.8453 31.4879 29.1333 32.0035L31.9893 37.1217H32.0107L37.3565 46.7386C38.9049 49.5359 39.8542 50.3111 42.0773 50.3111C44.7502 50.3111 46.6489 48.5626 46.6489 46.1395C46.6489 45.0657 46.4738 44.3164 45.6747 42.9919L41.6702 36.1813Z"
        fill="white"
      />
      <path
        d="M23.42 50.3102C25.9144 50.3102 27.9365 48.2881 27.9365 45.7937C27.9365 43.2994 25.9144 41.2773 23.42 41.2773C20.9256 41.2773 18.9036 43.2994 18.9036 45.7937C18.9036 48.2881 20.9256 50.3102 23.42 50.3102Z"
        fill="white"
      />
    </Icon>
  )
}

export const GradientGlyphPurple = ({
  boxSize,
  size,
  ...rest
}: IconProps & { size?: GlyphSize }) => (
  <Icon
    data-testid="glyph-icon"
    as="svg"
    role="img"
    boxSize={boxSize ?? iconSizeMap[size ?? "md"]}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    {...rest}
  >
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 0C2.23861 0 0 2.23861 0 5C0 7.76139 2.23861 10 5 10C7.76139 10 10 7.76139 10 5C10 2.23861 7.76139 0 5 0Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M6.51099 5.65333C6.4771 5.59569 6.49293 5.51944 6.55029 5.48485C7.05654 5.1793 7.32404 4.61902 7.32404 3.99694C7.32404 2.83388 6.56682 2.13916 5.16182 2.13916H3.46779H3.16002C3.06766 2.13916 3.00932 2.2386 3.05446 2.31916L3.52404 3.15846C3.54543 3.19666 3.58585 3.22041 3.6296 3.22041H4.1821H4.40613H5.01738C5.52863 3.22041 5.86043 3.5443 5.86043 4.02444C5.86043 4.51236 5.54821 4.82069 5.02127 4.82069H4.65766C4.56529 4.82069 4.5071 4.91999 4.5521 5.00055L4.99835 5.80027H5.00168L5.83696 7.30291C6.07891 7.73999 6.22724 7.86111 6.5746 7.86111C6.99224 7.86111 7.2889 7.58791 7.2889 7.2093C7.2889 7.04152 7.26154 6.92444 7.13668 6.71749L6.51099 5.65333Z"
        fill="white"
      />
      <path
        d="M3.65937 7.8611C4.04911 7.8611 4.36506 7.54515 4.36506 7.1554C4.36506 6.76566 4.04911 6.44971 3.65937 6.44971C3.26962 6.44971 2.95367 6.76566 2.95367 7.1554C2.95367 7.54515 3.26962 7.8611 3.65937 7.8611Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="10"
          y1="0.0781247"
          x2="3.0268e-07"
          y2="10.0781"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#D669FF" />
          <stop offset="1" stopColor="#7161EF" />
        </linearGradient>
      </defs>
    </svg>
  </Icon>
)

export const GradientGlyph = ({ boxSize, size, ...rest }: IconProps & { size?: GlyphSize }) => (
  <Icon
    data-testid="glyph-icon"
    as="svg"
    role="img"
    boxSize={boxSize ?? iconSizeMap[size ?? "md"]}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    {...rest}
  >
    <path
      d="M16 0C7.16356 0 0 7.16356 0 16C0 24.8364 7.16356 32 16 32C24.8364 32 32 24.8364 32 16C32 7.16356 24.8364 0 16 0Z"
      fill="white"
    />
    <path
      d="M20.8366 18.0903C20.7281 17.9059 20.7788 17.6619 20.9624 17.5512C22.5824 16.5734 23.4384 14.7805 23.4384 12.7899C23.4384 9.06808 21.0152 6.84497 16.5192 6.84497H10.1135C9.81792 6.84497 9.63125 7.16319 9.77569 7.42097L11.2784 10.1067C11.3468 10.229 11.4761 10.305 11.6161 10.305H16.057C17.693 10.305 18.7548 11.3414 18.7548 12.8779C18.7548 14.4392 17.7557 15.4259 16.0695 15.4259H14.9059C14.6104 15.4259 14.4241 15.7436 14.5681 16.0014L15.9961 18.5605H16.0068L18.6797 23.369C19.4539 24.7676 19.9286 25.1552 21.0401 25.1552C22.3766 25.1552 23.3259 24.281 23.3259 23.0694C23.3259 22.5325 23.2384 22.1579 22.8388 21.4956L20.8366 18.0903Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M11.7113 25.1545C12.9585 25.1545 13.9696 24.1435 13.9696 22.8963C13.9696 21.6491 12.9585 20.6381 11.7113 20.6381C10.4642 20.6381 9.45312 21.6491 9.45312 22.8963C9.45312 24.1435 10.4642 25.1545 11.7113 25.1545Z"
      fill="url(#paint1_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="23.4384"
        y1="6.98802"
        x2="5.77333"
        y2="20.4805"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D669FF" />
        <stop offset="1" stopColor="#7161EF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1="23.4384"
        y1="6.98802"
        x2="5.77333"
        y2="20.4805"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#D669FF" />
        <stop offset="1" stopColor="#7161EF" />
      </linearGradient>
    </defs>
  </Icon>
)

export default Glyph
