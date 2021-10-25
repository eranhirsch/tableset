/**
 * Ported (manually) from HSL.
 *
 * Methods not needed in JS:
 * * `concat` === `Array.concat`
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/combine.php
 */

import { tuple } from "common";

/**
 * @returns an array where each element is a tuple (pair) that combines,
 * pairwise, the elements of the two given arrays.
 *
 * If the arrays are not of equal length, the result will have the same number
 * of elements as the shortest array. Elements of the longer Traversable after
 * the length of the shorter one will be ignored.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.zip/
 */
const zip = <Tleft, Tright>(
  left: readonly Tleft[],
  right: readonly Tright[]
): readonly (readonly [left: Tleft, right: Tright])[] =>
  left.length <= right.length
    ? left.map((value, index) => tuple(value, right[index]))
    : right.map((value, index) => tuple(left[index], value));

/**
 * The typescript typing for concat on a ReadOnlyArray returns a mutable
 * array. To make sure that our API is the safest possible we export it
 * here retyped with readonly properties on it.
 */
const concat = <T>(
  first: readonly T[],
  ...rest: readonly (T | ConcatArray<T>)[]
): readonly T[] => first.concat(...rest);

/**
 * Typescript typing for flatten on a ReadOnlyArray returns a mutable array. To
 * make sure that our API is the safest possible we export it here retyped with
 * readonly properties on it.
 */
const flatten = <T>(arr: readonly (readonly T[])[]): readonly T[] =>
  arr.flat(1);

export const Vec = {
  zip,
  concat,
  flatten,
} as const;
