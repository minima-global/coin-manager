import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to add two decimal strings with exact precision
export const addDecimalStrings = (a: string, b: string): string => {
  // Normalize decimal places
  const [aWhole = "0", aDecimal = ""] = a.split(".");
  const [bWhole = "0", bDecimal = ""] = b.split(".");

  // Pad decimals to same length
  const maxDecimalLength = Math.max(aDecimal.length, bDecimal.length);
  const normalizedADecimal = aDecimal.padEnd(maxDecimalLength, "0");
  const normalizedBDecimal = bDecimal.padEnd(maxDecimalLength, "0");

  // Convert to integers for exact addition
  const aAsInt = BigInt(aWhole + normalizedADecimal);
  const bAsInt = BigInt(bWhole + normalizedBDecimal);
  const sumAsInt = aAsInt + bAsInt;

  // Convert back to decimal string
  const sumAsString = sumAsInt.toString();
  const wholePart = sumAsString.slice(0, -maxDecimalLength) || "0";
  const decimalPart = sumAsString.slice(-maxDecimalLength);

  return decimalPart ? `${wholePart}.${decimalPart}` : wholePart;
};
