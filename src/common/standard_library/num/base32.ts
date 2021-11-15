import { invariant } from "common";

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

/**
 * This was computed by doing `encode_base32(Number.MAX_SAFE_INTEGER)`
 */
const MAX_SAFE_INTEGER_ENCODED = "7VVVVVVVVVV";

const encode_base32 = (x: number | bigint): string =>
  REPLACEMENTS.reduce(
    (out, [from, to]) => out.replace(new RegExp(from, "g"), to),
    x.toString(32).toUpperCase()
  );

function decode_base32(x: string): number {
  invariant(
    x.length < MAX_SAFE_INTEGER_ENCODED.length,
    `Encoded string ${x} might overflow a regular number`
  );
  return Number.parseInt(
    REPLACEMENTS.reduce(
      (out, [to, from]) => out.replace(new RegExp(from, "g"), to),
      x
    ),
    32
  );
}

export const Num = {
  encode_base32,
  decode_base32,
} as const;
