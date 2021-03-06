/**
 * Ported (manually) from HSL.
 *
 * Methods not needed in JS:
 * * `flatten` === `Array.flat`
 * * `map` === `Array.map`
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/vec/transform.php
 */

import { Vec as V } from "common";
import { DictLike, ValueOf } from "../_private/typeUtils";

/**
 * @returns a new array of size `size` where all the values are `value`
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.fill/
 */
const fill = <Tv>(size: number, value: Tv): readonly Tv[] =>
  new Array(size).fill(value);

/**
 * @returns a new array where each value is the result of calling the given
 * function on the original key and value.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.map_with_key/
 */
const map_with_key = <T extends DictLike, Tv>(
  dict: Readonly<T>,
  valueFunc: (key: keyof T, value: ValueOf<T>, index: number) => Tv
): readonly Tv[] =>
  V.map(V.entries(dict), ([key, value], index) => valueFunc(key, value, index));

/**
 * The typing for the ReadonlyArray's map method doesn't return a readonly array
 * as a result. This kinda doesn't match expectations so we wrap it with better
 * typing here.
 */
const map = <V1, V2>(
  arr: readonly V1[],
  valueFunc: (item: V1, index: number) => V2
): readonly V2[] => arr.map(valueFunc);

/**
 * Rotates the array so that elements from it's tail are pushed back to the
 * head in the same order.
 *
 * Use a negative number to rotate in the opposite direction.
 */
function rotate<T>(arr: readonly T[], steps: number): readonly T[] {
  // We can't rotate more than the array's length
  steps = steps % arr.length;

  if (steps === 0) {
    return arr;
  }

  // Negative steps rotate backwards
  steps = steps > 0 ? steps : arr.length + steps;

  return V.concat(
    V.drop(arr, arr.length - steps),
    V.take(arr, arr.length - steps)
  );
}

export const Vec = {
  fill,
  map,
  map_with_key,
  rotate,
} as const;
