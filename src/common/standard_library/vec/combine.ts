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
const zip = <Tv, Tu>(
  first: readonly Tv[],
  second: readonly Tu[]
): readonly (readonly [Tv, Tu])[] =>
  first.length <= second.length
    ? first.map((value, index) => tuple(value, second[index]))
    : second.map((value, index) => tuple(first[index], value));

export const Vec = {
  zip,
} as const;
