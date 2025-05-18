import { NUMBER_OF_DECIMALS, BASE_10 } from "./../constants/round-number-constants.js";

export function roundNumber(num: number, scale: number = NUMBER_OF_DECIMALS): number {
  if (!num.toString().includes("e")) {
    return Number(Math.round(num * Math.pow(BASE_10, scale)) / Math.pow(BASE_10, scale));
  } else {
    const [base, exponent] = num.toString().split("e");
    const newExponent = Number(exponent) + scale;
    return Number(Math.round(Number(base) * Math.pow(BASE_10, newExponent)) / Math.pow(BASE_10, scale));
  }
}
