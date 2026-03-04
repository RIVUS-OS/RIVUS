/**
 * OIB checksum validation (ISO 7064, MOD 11,10)
 * Matches DB function is_valid_oib() exactly.
 */
export function isValidOib(oibRaw: string): boolean {
  const oib = (oibRaw ?? "").replace(/\s+/g, "");
  if (!/^\d{11}$/.test(oib)) return false;

  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = a + parseInt(oib[i], 10);
    a = a % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  let control = 11 - a;
  if (control === 10) control = 0;
  return control === parseInt(oib[10], 10);
}
