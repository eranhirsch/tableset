/**
 * Basic random methods. Inspired by HSL PseudoRandom namespace
 *
 * @see `Vec.shuffle` for a random permutation
 * @see `Vec.sample` for a random subgroup
 * @see `Dict.shuffle` for a random reordering of an object-mapper's entries
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/random/pseudo.php
 */

import { Dict, Vec } from "common";
import { DictLike } from "./_private/typeUtils";

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

/**
 * @returns a new array with the values of the given array in a random order.
 *
 * Based on an answer in stackoverflow implementing the Fisher-Yates shuffle.
 *
 * @see https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
 * @see https://stackoverflow.com/a/2450976
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.shuffle/
 */
function shuffle<T>(arr: readonly T[]): readonly T[] {
  if (Vec.is_empty(arr)) {
    return arr;
  }

  const out = [...arr];
  for (const currentIndex of Vec.range(arr.length, 0)) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    [out[currentIndex - 1], out[randomIndex]] = [
      out[randomIndex],
      out[currentIndex - 1],
    ];
  }
  return out;
}

/**
 * @returns a new mapper-obj with the key value pairs of the given input
 * container in a random order.
 *
 * `shuffle` is not using cryptographically secure randomness.
 */
// TODO: See how we can merge this into the array shuffle method
const shuffle_dict = <T extends DictLike>(dict: Readonly<T>): Readonly<T> =>
  Dict.from_entries(shuffle(Vec.entries(dict)));

export const Random = {
  float,
  index,
  int,
  string,
  coin_flip,
  shuffle,
  shuffle_dict,
} as const;
