import { $, $invariant, $log } from "common";

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

const encode_base32 = (x: number | bigint, separator?: string): string =>
  $(
    x.toString(32).toUpperCase(),
    ($$) =>
      REPLACEMENTS.reduce(
        (out, [from, to]) => out.replace(new RegExp(from, "g"), to),
        $$
      ),
    ($$) => (separator != null ? split($$).join(separator) : $$)
  );

const decode_base32 = (x: string): number =>
  $(
    // Sanitize the string
    // TODO: We only clean the separator we added ourselves, we need to make
    // this regex catch ANYTHING that isn't legal.
    x.replace(new RegExp("-", "g"), ""),
    $invariant(
      ($$) => $$.length < MAX_SAFE_INTEGER_ENCODED.length,
      `Encoded string ${x} might overflow a regular number`
    ),
    ($$) =>
      REPLACEMENTS.reduce(
        (out, [to, from]) => out.replace(new RegExp(from, "g"), to),
        $$
      ),
    ($$) => Number.parseInt($$, 32),
    $log()
  );

function split(encoded: string): readonly string[] {
  switch (encoded.length) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return [encoded];

    case 6: // XXX-XXX
    case 7: // XXX-XXXX
      return [encoded.slice(0, 3), encoded.slice(3)];

    case 8: // XXXX-XXXX
      return [encoded.slice(0, 4), encoded.slice(4)];

    case 9: // XXX-XXX-XXX
      return [encoded.slice(0, 3), encoded.slice(3, 6), encoded.slice(6)];

    case 10: // XXX-XXXX-XXX
    case 11: // XXX-XXXX-XXXX
      return [encoded.slice(0, 3), encoded.slice(3, 7), encoded.slice(7)];

    case 12: // XXXX-XXXX-XXXX
      return [encoded.slice(0, 4), encoded.slice(4, 8), encoded.slice(8)];

    default:
      return [encoded];
  }
}

export const Num = {
  encode_base32,
  decode_base32,
} as const;
