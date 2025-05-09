import { N_INCHES_IN_FOOT } from "../constants/input-parser-constants.js";

const parseInput = (text: string, isFeet: boolean, emptyStringIsValid?: boolean): number => {
  const isValidNumber = (total: number) => {
    if (total > 0) {
      return total;
    } else {
      throw new Error("Input must be greater than 0");
    }
  };

  const parseFeetInchesNotation = (notation: string): number => {
    const matches = notation.split("-");
    let total: number;

    if (matches.length === 2) {
      const feet = parseInt(matches[0]);
      const inches = parseFloat(matches[1].replace('"', ""));
      total = feet * N_INCHES_IN_FOOT + inches;
      return isValidNumber(total);
    }

    if (notation.includes(`'`) && notation.includes(`"`)) {
      const matches = notation.split("'");
      total = parseInt(matches[0]) * N_INCHES_IN_FOOT + parseInt(matches[1]);
      return isValidNumber(total);
    } else if (notation.includes(`'`)) {
      total = parseInt(notation) * N_INCHES_IN_FOOT;
      return isValidNumber(total);
    } else if (notation.includes(`"`)) {
      total = parseInt(notation);
      return isValidNumber(total);
    }
    total = isFeet ? parseInt(notation) * N_INCHES_IN_FOOT : parseInt(notation);
    return isValidNumber(total);
  };

  if (
    /^(\d+)-(\d+)"$/.test(text) || // matches 10-10"
    /^(\d+)-(\d+)$/.test(text) || // matches 10-10
    /^(\d+)'-?(\d+)"$/.test(text) || // matches 10'-10"
    /^(\d+)'-?(\d+)$/.test(text) || // matches 10'-10
    /^\d+$/.test(text) || // matches 10
    /^(\d+)'$/.test(text) || // matches 10'
    /^(\d+)"/.test(text) || // matches 10"
    /^(\d+)'?(\d+)"$/.test(text) // matches 10'10"
  ) {
    return parseFeetInchesNotation(text);
  } else {
    if (emptyStringIsValid && /^$/.test(text)) {
      return 0;
    }
    throw new Error("Invalid Input");
  }
};

const inchesToFeet = (inches: number): string => {
  inches = Math.round(inches);
  const feet: number = Math.floor(inches / N_INCHES_IN_FOOT);
  const remainder: number = inches % N_INCHES_IN_FOOT;
  return `${feet != 0 ? feet : ""}${feet != 0 ? `'` : ""}${remainder ? remainder : ""}${remainder ? '"' : ""}`;
};

const parseIntegerInput = (input: string): number => {
  const trimmedInput = input.trim();

  if (trimmedInput === "") return 0;

  const parsed = Number(trimmedInput);

  if (isNaN(parsed) || parsed < 0) throw new Error("Input must be a non-negative number");

  return parsed;
};

export { parseInput, inchesToFeet, parseIntegerInput };
