/**
 * Currency conversion utilities for the survey platform.
 * ZAR and NAD are pegged 1:1, so ZAR is equivalent to NAD in the codebase.
 */

// Exchange rate: 1 USD = 18.66 ZAR (so $200 USD = R 3,732.00 ZAR)
export const EXCHANGE_RATE_ZAR_USD = 18.66;

/**
 * Converts South African Rand (ZAR) / Namibian Dollar (NAD) to US Dollars (USD).
 */
export function convertZarToUsd(zarAmount: number): number {
  if (!zarAmount || isNaN(zarAmount)) return 0;
  return Math.round((zarAmount / EXCHANGE_RATE_ZAR_USD) * 100) / 100;
}

/**
 * Converts US Dollars (USD) to South African Rand (ZAR) / Namibian Dollar (NAD).
 */
export function convertUsdToZar(usdAmount: number): number {
  if (!usdAmount || isNaN(usdAmount)) return 0;
  return Math.round((usdAmount * EXCHANGE_RATE_ZAR_USD) * 100) / 100;
}
