import { BigNumberish } from "@ethersproject/bignumber"
import { ethers } from "ethers"

const { formatUnits, parseUnits } = ethers.utils

export const formatMwei = (value?: string | BigNumberish) =>
  formatUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "mwei")

export const formatEther = (value?: string | BigNumberish) =>
  formatUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "ether")

export const parseMwei = (value?: string | BigNumberish) =>
  parseUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "mwei")

export const parseEther = (value?: string | BigNumberish) =>
  parseUnits(typeof value === "string" ? value || "0" : (value ?? 0).toString(), "ether")
