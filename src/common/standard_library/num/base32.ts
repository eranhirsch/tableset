/**
 * These characters are too similar in most fonts, making it hard to tell what
 * character to use when copying the string manually. We change them in the
 * encoded string to use the remaining 4 characters that aren't used (because we
 * use 10 digits + 22 characters === 32)
 */
const REPLACEMENTS = [
  ["0", "W"],
  ["1", "X"],
  ["O", "Y"],
  ["I", "Z"],
] as const;

const encode_base32 = (x: number): string =>
  REPLACEMENTS.reduce(
    (out, [from, to]) => out.replace(from, to),
    x.toString(32).toUpperCase()
  );

const decode_base32 = (x: string): number =>
  Number.parseInt(
    REPLACEMENTS.reduce((out, [to, from]) => out.replace(from, to), x),
    32
  );

export const Num = {
  encode_base32,
  decode_base32,
} as const;
