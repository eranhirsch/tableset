/**
 * Basic random methods. Inspired by HSL PseudoRandom namespace
 *
 * @see `Vec.shuffle` for a random permutation
 * @see `Vec.sample` for a random subgroup
 * @see `Dict.shuffle` for a random reordering of an object-mapper's entries
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/random/pseudo.php
 */

const ALPHA_NUMERIC =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * @returns a random number between 0 (inclusive) and `a` (exclusive), or
 * between `a` (inclusive) and `b` (exclusive) as a floating-point number.
 */
function float(a: number, b?: number) {
  const start = b == null ? 0 : a;
  const end = b ?? a;
  return start + Math.random() * (end - start);
}

/**
 * @returns true with a probability of `ratio`, so for example `coin_flip(0.5)`
 * would return true half of the times, and `coin_flip(0.1)` would return true
 * 1 tenth of the times.
 */
const coin_flip = (ratio: number) => Math.random() < ratio;

/**
 * @returns a random number between 0 (inclusive) and `a` (exclusive), or
 * between `a` (inclusive) and `b` (exclusive) as an integer.
 */
const int = (a: number, b?: number) => Math.floor(float(a, b));

/**
 * @returns a random index into the object. Using the result of this method on
 * the same object's index accessor (x[]) should return a valid element.
 */
const index = ({ length }: { length: number }): number => int(length);

/**
 * @returns a pseudorandom string of length `length`. The string is composed of
 * characters from `alphabet` if `alphabet` is specified. This is NOT suitable
 * for cryptographic uses.
 */
const string = (length: number, alphabet: string = ALPHA_NUMERIC): string =>
  new Array(length).map(() => alphabet[index(alphabet)]).join("");

export const Random = {
  float,
  index,
  int,
  string,
  coin_flip,
} as const;
