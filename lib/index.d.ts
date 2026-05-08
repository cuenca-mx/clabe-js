export const BANKS: Record<string, string>;
export const BANK_NAMES: Record<string, string>;
export const CARD_BINS: Record<string, string>;
export function validateClabe(clabe: string): boolean;
export function computeControlDigit(clabe: string): string;
export function getBankName(account: string | null | undefined): string | null;
export function getBankNameByBin(cardNumber: string | null | undefined): string | null;
export function getBankNameOrThrow(account: string): string;
export function generateNewClabes(
  numberOfClabes: number,
  prefix: string,
): string[];
export function addBank(bankCodeBanxico: string, bankName: string): void;
export function removeBank(bankCodeBanxico: string): void;
