import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Path: lib/utils.ts
/**
 * Format a price to a currency
 * @param price - The price to format
 * @param currency - The currency to format the price to
 * @returns The formatted price
 */
export function formatPrice(price: number, currency: string = "USD") {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  });
  return formatter.format(price);
}

