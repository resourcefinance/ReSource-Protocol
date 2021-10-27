import { Image, ImageProps } from "@chakra-ui/react"
import placeholder1 from "../assets/images/placeholder-1.jpg"
import placeholder2 from "../assets/images/placeholder-2.jpg"
import placeholder3 from "../assets/images/placeholder-3.jpg"
import placeholder4 from "../assets/images/placeholder-4.jpg"
import React from "react"

export const defaultImages = [placeholder1, placeholder2, placeholder3, placeholder4]

const cloudName = "https://res.cloudinary.com/resource-network/image/upload/"

interface CloudinaryImageProps extends ImageProps {
  src?: string
  quality?: "low" | "eco" | "good" | "best" | number
  placeholder?: "blur" | "pixelate" | "vectorize" | "predominant"
  minH?: string
}

const CoudinaryImage = (props: CloudinaryImageProps) => {
  const { quality, placeholder, minH, ...rest } = props
  const optimizedSrc = props.src
    ? optimizeImage(props.src, { quality, placeholder })
    : getRandomDefaultImage()
  return <Image minHeight={minH} {...rest} src={optimizedSrc} fallbackSrc={placeholder1}></Image>
}

type OptimizationOptions = {
  quality?: "low" | "eco" | "good" | "best" | number
  placeholder?: "blur" | "pixelate" | "vectorize" | "predominant"
}

export const optimizeImage = (url: string, options: OptimizationOptions): string => {
  if (!url.includes("res.cloudinary.com")) return url
  const { quality, placeholder } = options
  let optimizations = `${map.quality(quality)}${map.placeholder(placeholder)}`
  optimizations =
    quality || placeholder
      ? optimizations.substr(0, optimizations.length - 1) + "/"
      : optimizations + "/"
  const newUrl = url.substr(0, cloudName.length) + optimizations + url.substr(cloudName.length)
  return newUrl
}

const map = {
  quality: (q) => {
    if (typeof q === "number") {
      return `q_${q < 0 ? 0 : q > 100 ? 100 : q},`
    }
    return q ? `q_auto:${q},` : ""
  },
  placeholder: (p) => {
    return p ? `e_${p},` : ""
  },
}

export const getRandomDefaultImage = () => {
  const randomNumber = Math.floor(4 * Math.random())
  return defaultImages[randomNumber]
}

export default React.memo(CoudinaryImage)
