/**
 * Ported (manually) from HSL.
 *
 * @see https://github.com/facebook/hhvm/blob/master/hphp/hsl/src/c/reduce.php
 */

import { Vec } from "common";

/**
 * Reduces the given object-mapper into a single value by applying an
 * accumulator function against an intermediate result and each key/value.
 */
const reduce_with_key = <Tk extends keyof any, Tv, Ta>(
  keyedTraversable: Readonly<Record<Tk, Tv>>,
  reducer: (accumulator: Ta, key: Tk, value: Tv, index: number) => Ta,
  initial: Ta
): Ta =>
  Vec.entries(keyedTraversable).reduce(
    (accumulator, [key, value], index) =>
      reducer(accumulator, key, value, index),
    initial
  );

export const C = {
  reduce_with_key,
} as const;
