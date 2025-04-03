export function roundNumber(num: number, scale: number = 2): number {
  if (!num.toString().includes("e")) {
    return Number(Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale));
  } else {
    let [base, exponent] = num.toString().split("e");
    let newExponent = Number(exponent) + scale;
    return Number(Math.round(Number(base) * Math.pow(10, newExponent)) / Math.pow(10, scale));
  }
}
