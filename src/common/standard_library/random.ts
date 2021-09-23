/**
 * Basic random methods.
 *
 * @see `Vec.shuffle` for a random permutation
 * @see `Vec.sample` for a random subgroup
 * @see `Dict.shuffle` for a random reordering of an object-mapper's entries
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
 * @returns a random number between 0 (inclusive) and `a` (exclusive), or
 * between `a` (inclusive) and `b` (exclusive) as an integer.
 */
const int = (a: number, b?: number) => Math.floor(float(a, b));

/**
 * @returns a random index into the object. Using the result of this method on
 * the same object's index accessor (x[]) should return a valid element.
 */
const index = ({ length }: { length: number }): number => int(length);

const string = (length: number, alphabet: string = ALPHA_NUMERIC): string =>
  new Array(length).map(() => alphabet[index(alphabet)]).join("");

export const Random = {
  float,
  index,
  int,
  string,
} as const;
