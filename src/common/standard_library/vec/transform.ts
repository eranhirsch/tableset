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
  valueFunc: (key: keyof T, value: ValueOf<T>) => Tv
): readonly Tv[] =>
  V.entries(dict).map(([key, value]) => valueFunc(key, value));

/**
 * The typing for the ReadonlyArray's map method doesn't return a readonly array
 * as a result. This kinda doesn't match expectations so we wrap it with better
 * typing here.
 */
const map = <V1, V2>(
  arr: readonly V1[],
  valueFunc: (item: V1, index: number) => V2
): readonly V2[] => arr.map(valueFunc);

export const Vec = {
  fill,
  map,
  map_with_key,
} as const;
