import { ethers } from "ethers";
const Sha3 = require("crypto-js/sha3");

export function toEth(input) {
  return ethers.utils.formatUnits(input, "ether").toString();
}

export function truncateEthAddress(address) {
  const len = address.length;
  const start = address.substr(0, 6);
  const end = address.substr(len - 4, 4);
  return `${start}....${end}`;
}

export function percentage(a, b) {
  return Number((a / b) * 100).toFixed(2);
}

export function validateEthAddress(address) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
}

export function isChecksumAddress(address) {
  address = address.replace("0x", "");
  const addressHash = Sha3(address.toLowerCase());
  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
}
