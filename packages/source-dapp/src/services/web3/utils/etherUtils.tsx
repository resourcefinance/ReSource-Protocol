import { BigNumberish } from "@ethersproject/bignumber"
import { ethers } from "ethers"

const { formatUnits, parseUnits } = ethers.utils

export const formatMwei = (value?: string | BigNumberish) => {
  try {
    return formatUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "mwei")
  } catch (e) {
    return "0"
  }
}

export const formatEther = (value?: string | BigNumberish) => {
  try {
    return formatUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "ether")
  } catch (e) {
    return "0"
  }
}

export const parseMwei = (value?: string | BigNumberish) => {
  try {
    return parseUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "mwei")
  } catch (e) {
    return parseEther(value).div(1e12)
  }
}

export const parseEther = (value?: string | BigNumberish) => {
  try {
    return parseUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "ether")
  } catch (e) {
    return ethers.BigNumber.from(0)
  }
}
