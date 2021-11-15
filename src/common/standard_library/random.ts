/**
 * Basic random methods. Inspired by HSL PseudoRandom namespace
 *
 * @see `Vec.shuffle` for a random permutation
 * @see `Vec.sample` for a random subgroup
 * @see `Dict.shuffle` for a random reordering of an object-mapper's entries
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/random/pseudo.php
 */

import { Dict, invariant, invariant_violation, Vec } from "common";
import { DictLike } from "./_private/typeUtils";

const ALPHA_NUMERIC =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * @returns a random number between 0 (inclusive) and `a` (exclusive), or
 * between `a` (inclusive) and `b` (exclusive) as a floating-point number.
 */
function float(a: number, b?: number): number {
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
function int(a: number, b?: number): number;
function int(a: bigint, b?: bigint): bigint;
function int(a: number | bigint, b?: number | bigint): number | bigint {
  if (typeof a === "bigint") {
    if (b == null) {
      // TODO: We can't simply fallback to non-bigint numbers but there's no
      // easy way to generate a random number in range for bigint's...
      // This might return bogus results.
      invariant(
        a < BigInt(Number.MAX_SAFE_INTEGER),
        `Ranges bigger than ${
          Number.MAX_SAFE_INTEGER
        } are not supported, attempted with ${a.toString()}`
      );
      return BigInt(int(Number(a)));
    }

    if (typeof b === "bigint") {
      // TODO: Just like above, this is an approximation and would work only in
      // cases where the range itself is small and fits inside a regular number.
      invariant(
        b - a < BigInt(Number.MAX_SAFE_INTEGER),
        `Ranges bigger than ${
          Number.MAX_SAFE_INTEGER
        } are not supported, attempted with ${(b - a).toString()}`
      );
      return a + BigInt(int(Number(b - a)));
    }
  }

  if (typeof a === "number" && (b == null || typeof b === "number")) {
    return Math.floor(float(a, b));
  }

  invariant_violation(`Got mismatching types for a ${a} and b ${b}`);
}

/**
 * @returns a random index into the object. Using the result of this method on
 * the same object's index accessor (x[]) should return a valid element.
 */
function index({ length }: { length: number }): number;
function index({ length }: { length: bigint }): bigint;
function index({ length }: { length: number | bigint }): number | bigint {
  return typeof length === "bigint" ? int(length) : int(length);
}

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
 * @returns an array containing an unbiased random sample of up to sampleSize
 * elements (fewer iff sampleSize is larger than the size of the array)
 *
 * The output array would maintain the same item order.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.sample/
 */
 function sample<Tv>(arr: readonly Tv[], sampleSize: 1): Tv;
 function sample<Tv>(arr: readonly Tv[], sampleSize: 2): readonly [Tv, Tv];
 function sample<Tv>(arr: readonly Tv[], sampleSize: 3): readonly [Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 4
 ): readonly [Tv, Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 5
 ): readonly [Tv, Tv, Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 6
 ): readonly [Tv, Tv, Tv, Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 7
 ): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 8
 ): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 9
 ): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: 10
 ): readonly [Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv, Tv];
 function sample<Tv>(arr: readonly Tv[], sampleSize: number): readonly Tv[];
 function sample<Tv>(
   arr: readonly Tv[],
   sampleSize: number
 ): Tv | readonly Tv[] {
   if (sampleSize === 1) {
     return arr[index(arr)];
   }

  if (sampleSize >= arr.length) {
    // Trivial solution
    return arr;
  }
 
   // To optimize the selection we can toggle between an include and exclude
   // logic for the sample; when sampleSize is small we will pick a set of
   // random indices and use them to pick elements from the input array, and
   // when sampleSize is big we will pick which indices to skip when rebuilding
   // the array.
 
   // We use a set so that we can ignore duplicates
   const selectedIndices: Set<number> = new Set();
   while (selectedIndices.size < Math.min(sampleSize, arr.length - sampleSize)) {
     selectedIndices.add(index(arr));
   }
 
   return sampleSize <= arr.length - sampleSize
     ? Vec.map(Vec.sort([...selectedIndices]), (index) => arr[index])
     : Vec.filter(arr, (_, index) => !selectedIndices.has(index));
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
  coin_flip,
  float,
  index,
  int,
  sample,
  shuffle_dict,
  shuffle,
  string,
} as const;
