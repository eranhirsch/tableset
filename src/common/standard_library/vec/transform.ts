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
import { ValueOf } from "../_private/typeUtils";

/**
 * @returns an array containing the original vec split into chunks of the
 * given size.
 *
 * If the original vec doesn't divide evenly, the final chunk will be smaller.
 *
 * @see https://docs.hhvm.com/hsl/reference/function/HH.Lib.Vec.chunk/
 */
const chunk = <Tv>(
  arr: readonly Tv[],
  size: number
): readonly (readonly Tv[])[] =>
  arr.reduce(
    (out, item) => {
      let lastChunk = out[out.length - 1];
      if (lastChunk.length >= size) {
        lastChunk = [];
        out.push(lastChunk);
      }
      lastChunk.push(item);
      return out;
    },
    [[]] as Tv[][]
  );

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
const map_with_key = <T extends Record<keyof any, any>, Tv>(
  dict: Readonly<T>,
  valueFunc: (key: keyof T, value: ValueOf<T>) => Tv
): readonly Tv[] =>
  V.entries(dict).map(([key, value]) => valueFunc(key, value));

export const Vec = {
  chunk,
  fill,
  map_with_key,
} as const;
